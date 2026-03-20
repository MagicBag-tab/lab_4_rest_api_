import { Router } from 'express';
import pool from '../config/db.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM songs ORDER BY id');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM songs WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Song not found' });
    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/', async (req, res) => {
  const { campo1, campo2, campo3, campo4, campo5, campo6 } = req.body;

  if (
    campo1 === undefined || campo2 === undefined || campo3 === undefined ||
    campo4 === undefined || campo5 === undefined || campo6 === undefined
  ) {
    return res.status(400).json({ error: 'All fields are required: campo1, campo2, campo3, campo4, campo5, campo6' });
  }

  if (typeof campo1 !== 'string' || campo1.trim() === '') return res.status(400).json({ error: 'campo1 must be a non-empty string' });
  if (typeof campo2 !== 'string' || campo2.trim() === '') return res.status(400).json({ error: 'campo2 must be a non-empty string' });
  if (typeof campo3 !== 'string' || campo3.trim() === '') return res.status(400).json({ error: 'campo3 must be a non-empty string' });
  if (!Number.isInteger(campo4))                          return res.status(400).json({ error: 'campo4 must be an integer' });
  if (typeof campo5 !== 'number')                         return res.status(400).json({ error: 'campo5 must be a float' });
  if (typeof campo6 !== 'boolean')                        return res.status(400).json({ error: 'campo6 must be a boolean' });

  try {
    const { rows } = await pool.query(
      'INSERT INTO songs (campo1, campo2, campo3, campo4, campo5, campo6) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [campo1.trim(), campo2.trim(), campo3.trim(), campo4, campo5, campo6]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.put('/:id', async (req, res) => {
  const { campo1, campo2, campo3, campo4, campo5, campo6 } = req.body;

  if (
    campo1 === undefined || campo2 === undefined || campo3 === undefined ||
    campo4 === undefined || campo5 === undefined || campo6 === undefined
  ) {
    return res.status(400).json({ error: 'All fields are required for PUT' });
  }

  if (typeof campo1 !== 'string' || campo1.trim() === '') return res.status(400).json({ error: 'campo1 must be a non-empty string' });
  if (typeof campo2 !== 'string' || campo2.trim() === '') return res.status(400).json({ error: 'campo2 must be a non-empty string' });
  if (typeof campo3 !== 'string' || campo3.trim() === '') return res.status(400).json({ error: 'campo3 must be a non-empty string' });
  if (!Number.isInteger(campo4))                          return res.status(400).json({ error: 'campo4 must be an integer' });
  if (typeof campo5 !== 'number')                         return res.status(400).json({ error: 'campo5 must be a float' });
  if (typeof campo6 !== 'boolean')                        return res.status(400).json({ error: 'campo6 must be a boolean' });

  try {
    const { rows } = await pool.query(
      'UPDATE songs SET campo1=$1, campo2=$2, campo3=$3, campo4=$4, campo5=$5, campo6=$6 WHERE id=$7 RETURNING *',
      [campo1.trim(), campo2.trim(), campo3.trim(), campo4, campo5, campo6, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Song not found' });
    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.patch('/:id', async (req, res) => {
  const allowed = ['campo1', 'campo2', 'campo3', 'campo4', 'campo5', 'campo6'];
  const fields = Object.keys(req.body).filter(k => allowed.includes(k));

  if (fields.length === 0) return res.status(400).json({ error: 'No valid fields provided' });

  for (const field of fields) {
    const val = req.body[field];
    if (['campo1','campo2','campo3'].includes(field) && (typeof val !== 'string' || val.trim() === ''))
      return res.status(400).json({ error: `${field} must be a non-empty string` });
    if (field === 'campo4' && !Number.isInteger(val))
      return res.status(400).json({ error: 'campo4 must be an integer' });
    if (field === 'campo5' && typeof val !== 'number')
      return res.status(400).json({ error: 'campo5 must be a float' });
    if (field === 'campo6' && typeof val !== 'boolean')
      return res.status(400).json({ error: 'campo6 must be a boolean' });
  }

  const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
  const values    = fields.map(f => typeof req.body[f] === 'string' ? req.body[f].trim() : req.body[f]);
  values.push(req.params.id);

  try {
    const { rows } = await pool.query(
      `UPDATE songs SET ${setClause} WHERE id = $${values.length} RETURNING *`,
      values
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Song not found' });
    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM songs WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ error: 'Song not found' });
    res.status(200).json({ message: 'Song deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;