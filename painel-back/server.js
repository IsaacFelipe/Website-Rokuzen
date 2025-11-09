const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const ensureSchemaPromise = ensureSchema();

async function ensureSchema() {
    const createTherapistsTable = `
        CREATE TABLE IF NOT EXISTS painel_therapists (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            specialty VARCHAR(255) NOT NULL,
            phone VARCHAR(32) NOT NULL,
            email VARCHAR(255) DEFAULT NULL,
            cpf VARCHAR(32) DEFAULT NULL,
            birth_date DATE DEFAULT NULL,
            status VARCHAR(32) NOT NULL DEFAULT 'ativo',
            hire_date DATE DEFAULT NULL,
            address VARCHAR(255) DEFAULT NULL,
            notes TEXT DEFAULT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;

    const createClientsTable = `
        CREATE TABLE IF NOT EXISTS painel_clients (
            id INT AUTO_INCREMENT PRIMARY KEY,
            full_name VARCHAR(255) NOT NULL,
            cpf VARCHAR(32) DEFAULT NULL,
            birth_date DATE DEFAULT NULL,
            phone VARCHAR(32) NOT NULL,
            email VARCHAR(255) DEFAULT NULL,
            address VARCHAR(255) DEFAULT NULL,
            status VARCHAR(32) NOT NULL DEFAULT 'ativo',
            registration_date DATE DEFAULT NULL,
            notes TEXT DEFAULT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;

    const createAppointmentsTable = `
        CREATE TABLE IF NOT EXISTS painel_appointments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            client_id INT NULL,
            therapist_id INT NULL,
            datetime DATETIME NOT NULL,
            duration INT NOT NULL,
            session_type VARCHAR(255) DEFAULT NULL,
            payment_type VARCHAR(32) DEFAULT NULL,
            payment_status VARCHAR(32) DEFAULT NULL,
            appointment_status VARCHAR(32) DEFAULT NULL,
            value DECIMAL(10,2) DEFAULT 0,
            notes TEXT DEFAULT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_datetime (datetime),
            CONSTRAINT fk_painel_appointment_client FOREIGN KEY (client_id) REFERENCES painel_clients(id) ON DELETE SET NULL,
            CONSTRAINT fk_painel_appointment_therapist FOREIGN KEY (therapist_id) REFERENCES painel_therapists(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;

    await db.query(createTherapistsTable);
    await db.query(createClientsTable);
    await db.query(createAppointmentsTable);
}

function formatDate(value) {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDateTime(value) {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const datePart = formatDate(value);
    if (!datePart) return null;
    return `${datePart} ${hours}:${minutes}`;
}

function mapTherapist(row) {
    return {
        id: row.id,
        name: row.name,
        specialty: row.specialty,
        phone: row.phone,
        email: row.email || '',
        cpf: row.cpf || '',
        birthDate: formatDate(row.birth_date),
        status: row.status,
        hireDate: formatDate(row.hire_date),
        address: row.address || '',
        notes: row.notes || '',
        createdAt: formatDateTime(row.created_at),
        updatedAt: formatDateTime(row.updated_at)
    };
}

function mapClient(row, aggregated = {}) {
    return {
        id: row.id,
        fullName: row.full_name,
        cpf: row.cpf || '',
        birthDate: formatDate(row.birth_date),
        phone: row.phone,
        email: row.email || '',
        address: row.address || '',
        status: row.status,
        registrationDate: formatDate(row.registration_date),
        notes: row.notes || '',
        totalSessions: aggregated.totalSessions || 0,
        totalSpent: Number(aggregated.totalSpent || 0),
        favoriteTherapist: aggregated.favoriteTherapist || '',
        favoriteSession: aggregated.favoriteSession || '',
        lastVisit: aggregated.lastVisit ? formatDate(aggregated.lastVisit) : null,
        createdAt: formatDateTime(row.created_at),
        updatedAt: formatDateTime(row.updated_at)
    };
}

function mapAppointment(row) {
    return {
        id: row.id,
        clientId: row.client_id,
        therapistId: row.therapist_id,
        datetime: formatDateTime(row.datetime),
        duration: row.duration,
        sessionType: row.session_type || '',
        paymentType: row.payment_type || '',
        paymentStatus: row.payment_status || '',
        appointmentStatus: row.appointment_status || '',
        value: Number(row.value || 0),
        notes: row.notes || '',
        client: row.client_name || '',
        phone: row.client_phone || '',
        therapist: row.therapist_name || '',
        createdAt: formatDateTime(row.created_at),
        updatedAt: formatDateTime(row.updated_at)
    };
}

app.get('/api/health', async (_req, res) => {
    try {
        await ensureSchemaPromise;
        await db.query('SELECT 1');
        res.json({ status: 'ok' });
    } catch (error) {
        console.error('Erro ao verificar saúde da API:', error);
        res.status(500).json({ status: 'error', message: 'Erro ao acessar o banco de dados.' });
    }
});

app.get('/api/dashboard/overview', async (_req, res) => {
    try {
        await ensureSchemaPromise;
        const [[counts]] = await db.query(`
            SELECT
                (SELECT COUNT(*) FROM painel_therapists) AS totalTherapists,
                (SELECT COUNT(*) FROM painel_therapists WHERE status = 'ativo') AS activeTherapists,
                (SELECT COUNT(*) FROM painel_appointments WHERE DATE(datetime) = CURDATE()) AS appointmentsToday,
                (SELECT COUNT(DISTINCT client_id) FROM painel_appointments WHERE DATE(datetime) = CURDATE()) AS clientsToday
        `);
        res.json(counts);
    } catch (error) {
        console.error('Erro ao carregar overview:', error);
        res.status(500).json({ message: 'Erro ao carregar dados do dashboard.' });
    }
});

app.get('/api/therapists', async (_req, res) => {
    try {
        await ensureSchemaPromise;
        const [rows] = await db.query('SELECT * FROM painel_therapists ORDER BY created_at DESC');
        res.json(rows.map(mapTherapist));
    } catch (error) {
        console.error('Erro ao listar terapeutas:', error);
        res.status(500).json({ message: 'Erro ao buscar terapeutas.' });
    }
});

app.post('/api/therapists', async (req, res) => {
    const data = req.body;
    try {
        await ensureSchemaPromise;
        const insertSql = `
            INSERT INTO painel_therapists
                (name, specialty, phone, email, cpf, birth_date, status, hire_date, address, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            data.name,
            data.specialty,
            data.phone,
            data.email || null,
            data.cpf || null,
            data.birthDate || null,
            data.status || 'ativo',
            data.hireDate || null,
            data.address || null,
            data.notes || null
        ];
        const [result] = await db.query(insertSql, values);
        const [[row]] = await db.query('SELECT * FROM painel_therapists WHERE id = ?', [result.insertId]);
        res.status(201).json(mapTherapist(row));
    } catch (error) {
        console.error('Erro ao criar terapeuta:', error);
        res.status(500).json({ message: 'Erro ao criar terapeuta.' });
    }
});

app.put('/api/therapists/:id', async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        await ensureSchemaPromise;
        const updateSql = `
            UPDATE painel_therapists
               SET name = ?, specialty = ?, phone = ?, email = ?, cpf = ?, birth_date = ?,
                   status = ?, hire_date = ?, address = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?
        `;
        const values = [
            data.name,
            data.specialty,
            data.phone,
            data.email || null,
            data.cpf || null,
            data.birthDate || null,
            data.status || 'ativo',
            data.hireDate || null,
            data.address || null,
            data.notes || null,
            id
        ];
        await db.query(updateSql, values);
        const [[row]] = await db.query('SELECT * FROM painel_therapists WHERE id = ?', [id]);
        res.json(mapTherapist(row));
    } catch (error) {
        console.error('Erro ao atualizar terapeuta:', error);
        res.status(500).json({ message: 'Erro ao atualizar terapeuta.' });
    }
});

app.delete('/api/therapists/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await ensureSchemaPromise;
        await db.query('UPDATE painel_appointments SET therapist_id = NULL WHERE therapist_id = ?', [id]);
        await db.query('DELETE FROM painel_therapists WHERE id = ?', [id]);
        res.status(204).send();
    } catch (error) {
        console.error('Erro ao excluir terapeuta:', error);
        res.status(500).json({ message: 'Erro ao excluir terapeuta.' });
    }
});

app.get('/api/clients', async (_req, res) => {
    try {
        await ensureSchemaPromise;
        const [clientRows] = await db.query('SELECT * FROM painel_clients ORDER BY created_at DESC');

        const [appointments] = await db.query(`
            SELECT a.*, c.full_name AS client_name, t.name AS therapist_name
              FROM painel_appointments a
              LEFT JOIN painel_clients c ON c.id = a.client_id
              LEFT JOIN painel_therapists t ON t.id = a.therapist_id
        `);

        const appointmentsByClient = new Map();
        appointments.forEach((appointment) => {
            if (!appointmentsByClient.has(appointment.client_id)) {
                appointmentsByClient.set(appointment.client_id, []);
            }
            appointmentsByClient.get(appointment.client_id).push(appointment);
        });

        const enriched = clientRows.map((client) => {
            const relatedAppointments = appointmentsByClient.get(client.id) || [];
            const totalSessions = relatedAppointments.length;
            const totalSpent = relatedAppointments.reduce((acc, item) => acc + Number(item.value || 0), 0);
            const lastVisit = relatedAppointments.reduce((latest, item) => {
                if (!item.datetime) return latest;
                return !latest || item.datetime > latest ? item.datetime : latest;
            }, null);

            const therapistFrequency = new Map();
            const sessionFrequency = new Map();

            relatedAppointments.forEach((item) => {
                if (item.therapist_name) {
                    therapistFrequency.set(
                        item.therapist_name,
                        (therapistFrequency.get(item.therapist_name) || 0) + 1
                    );
                }
                if (item.session_type) {
                    sessionFrequency.set(
                        item.session_type,
                        (sessionFrequency.get(item.session_type) || 0) + 1
                    );
                }
            });

            const favoriteTherapist = [...therapistFrequency.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || '';
            const favoriteSession = [...sessionFrequency.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || '';

            return mapClient(client, {
                totalSessions,
                totalSpent,
                lastVisit,
                favoriteTherapist,
                favoriteSession
            });
        });

        res.json(enriched);
    } catch (error) {
        console.error('Erro ao listar clientes:', error);
        res.status(500).json({ message: 'Erro ao buscar clientes.' });
    }
});

app.post('/api/clients', async (req, res) => {
    const data = req.body;
    try {
        await ensureSchemaPromise;
        const insertSql = `
            INSERT INTO painel_clients
                (full_name, cpf, birth_date, phone, email, address, status, registration_date, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            data.fullName,
            data.cpf || null,
            data.birthDate || null,
            data.phone,
            data.email || null,
            data.address || null,
            data.status || 'ativo',
            data.registrationDate || null,
            data.notes || null
        ];
        const [result] = await db.query(insertSql, values);
        const [[row]] = await db.query('SELECT * FROM painel_clients WHERE id = ?', [result.insertId]);
        res.status(201).json(mapClient(row));
    } catch (error) {
        console.error('Erro ao criar cliente:', error);
        res.status(500).json({ message: 'Erro ao criar cliente.' });
    }
});

app.put('/api/clients/:id', async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        await ensureSchemaPromise;
        const updateSql = `
            UPDATE painel_clients
               SET full_name = ?, cpf = ?, birth_date = ?, phone = ?, email = ?, address = ?,
                   status = ?, registration_date = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?
        `;
        const values = [
            data.fullName,
            data.cpf || null,
            data.birthDate || null,
            data.phone,
            data.email || null,
            data.address || null,
            data.status || 'ativo',
            data.registrationDate || null,
            data.notes || null,
            id
        ];
        await db.query(updateSql, values);
        const [[row]] = await db.query('SELECT * FROM painel_clients WHERE id = ?', [id]);
        res.json(mapClient(row));
    } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        res.status(500).json({ message: 'Erro ao atualizar cliente.' });
    }
});

app.delete('/api/clients/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await ensureSchemaPromise;
        const [[{ total }]] = await db.query('SELECT COUNT(*) AS total FROM painel_appointments WHERE client_id = ?', [id]);
        if (total > 0) {
            return res.status(409).json({ message: 'Não é possível excluir um cliente com atendimentos registrados.' });
        }
        await db.query('DELETE FROM painel_clients WHERE id = ?', [id]);
        res.status(204).send();
    } catch (error) {
        console.error('Erro ao excluir cliente:', error);
        res.status(500).json({ message: 'Erro ao excluir cliente.' });
    }
});

app.get('/api/appointments', async (req, res) => {
    const { date } = req.query;
    try {
        await ensureSchemaPromise;
        let sql = `
            SELECT a.*, c.full_name AS client_name, c.phone AS client_phone,
                   t.name AS therapist_name
              FROM painel_appointments a
              LEFT JOIN painel_clients c ON c.id = a.client_id
              LEFT JOIN painel_therapists t ON t.id = a.therapist_id
        `;
        const params = [];
        if (date) {
            sql += ' WHERE DATE(a.datetime) = ?';
            params.push(date);
        }
        sql += ' ORDER BY a.datetime DESC';

        const [rows] = await db.query(sql, params);
        res.json(rows.map(mapAppointment));
    } catch (error) {
        console.error('Erro ao listar atendimentos:', error);
        res.status(500).json({ message: 'Erro ao buscar atendimentos.' });
    }
});

async function ensureClient(data) {
    if (data.clientId) {
        return data.clientId;
    }
    if (!data.clientPhone) {
        return null;
    }
    const [[existing]] = await db.query('SELECT id FROM painel_clients WHERE phone = ?', [data.clientPhone]);
    if (existing) {
        return existing.id;
    }
    const insertSql = `
        INSERT INTO painel_clients (full_name, phone, status, registration_date)
        VALUES (?, ?, 'ativo', CURDATE())
    `;
    const [result] = await db.query(insertSql, [data.clientName || 'Cliente', data.clientPhone]);
    return result.insertId;
}

app.post('/api/appointments', async (req, res) => {
    const data = req.body;
    try {
        await ensureSchemaPromise;

        const clientId = await ensureClient(data);
        const datetime = `${data.appointmentDate} ${data.appointmentTime}:00`;

        const insertSql = `
            INSERT INTO painel_appointments
                (client_id, therapist_id, datetime, duration, session_type, payment_type,
                 payment_status, appointment_status, value, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            clientId,
            data.therapistId || null,
            datetime,
            parseInt(data.duration, 10) || 0,
            data.sessionType || null,
            data.paymentType || null,
            data.paymentStatus || null,
            data.appointmentStatus || null,
            Number(data.appointmentValue || 0),
            data.appointmentNotes || null
        ];
        const [result] = await db.query(insertSql, values);
        const [[row]] = await db.query(`
            SELECT a.*, c.full_name AS client_name, c.phone AS client_phone,
                   t.name AS therapist_name
              FROM painel_appointments a
              LEFT JOIN painel_clients c ON c.id = a.client_id
              LEFT JOIN painel_therapists t ON t.id = a.therapist_id
             WHERE a.id = ?
        `, [result.insertId]);
        res.status(201).json(mapAppointment(row));
    } catch (error) {
        console.error('Erro ao criar atendimento:', error);
        res.status(500).json({ message: 'Erro ao criar atendimento.' });
    }
});

app.put('/api/appointments/:id', async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        await ensureSchemaPromise;
        const clientId = await ensureClient(data);
        const datetime = `${data.appointmentDate} ${data.appointmentTime}:00`;

        const updateSql = `
            UPDATE painel_appointments
               SET client_id = ?, therapist_id = ?, datetime = ?, duration = ?, session_type = ?,
                   payment_type = ?, payment_status = ?, appointment_status = ?, value = ?, notes = ?,
                   updated_at = CURRENT_TIMESTAMP
             WHERE id = ?
        `;
        const values = [
            clientId,
            data.therapistId || null,
            datetime,
            parseInt(data.duration, 10) || 0,
            data.sessionType || null,
            data.paymentType || null,
            data.paymentStatus || null,
            data.appointmentStatus || null,
            Number(data.appointmentValue || 0),
            data.appointmentNotes || null,
            id
        ];
        await db.query(updateSql, values);
        const [[row]] = await db.query(`
            SELECT a.*, c.full_name AS client_name, c.phone AS client_phone,
                   t.name AS therapist_name
              FROM painel_appointments a
              LEFT JOIN painel_clients c ON c.id = a.client_id
              LEFT JOIN painel_therapists t ON t.id = a.therapist_id
             WHERE a.id = ?
        `, [id]);
        res.json(mapAppointment(row));
    } catch (error) {
        console.error('Erro ao atualizar atendimento:', error);
        res.status(500).json({ message: 'Erro ao atualizar atendimento.' });
    }
});

app.delete('/api/appointments/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await ensureSchemaPromise;
        await db.query('DELETE FROM painel_appointments WHERE id = ?', [id]);
        res.status(204).send();
    } catch (error) {
        console.error('Erro ao excluir atendimento:', error);
        res.status(500).json({ message: 'Erro ao excluir atendimento.' });
    }
});

app.listen(PORT, () => {
    console.log(`API Painel rodando na porta ${PORT}`);
});

