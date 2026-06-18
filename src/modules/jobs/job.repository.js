const { query } = require('../../shared/utils/db');

const JobRepository = {
  async findAll() {
    const sql = `
      SELECT job_id, job_title, min_salary, max_salary
      FROM   jobs
      ORDER  BY job_id
    `;
    const result = await query(sql);
    console.log(result)
    return result.rows;
  },

  async findById(id) {
    const sql = `
      SELECT job_id, job_title, min_salary, max_salary
      FROM   jobs
      WHERE  job_id = :id
    `;
    const result = await query(sql, { id });
    return result.rows[0] || null;
  },

  async create(data) {
    const sql = `
      INSERT INTO jobs (job_id, job_title, min_salary, max_salary)
      VALUES (jobs_seq.NEXTVAL, :job_title, :min_salary, :max_salary)
      RETURNING job_id INTO :out_id
    `;
    const binds = {
      job_title: data.job_title.trim(),
      min_salary: data.min_salary.trim(),
      max_salary: data.max_salary.trim(),
      out_id: { dir: require('oracledb').BIND_OUT, type: require('oracledb').NUMBER },
    };
    const result = await query(sql, binds);
    const newId  = result.outBinds.out_id[0];
    return this.findById(newId);
  },

  async update(id, data) {
    const sql = `
      UPDATE jobs
      SET    job_title = :job_title, min_salary = :min_salary, max_salary = :max_salary
      WHERE  job_id   = :id
    `;
    const result = await query(sql, {
      job_title: data.job_title.trim(),
      min_salary: data.min_salary.trim(),
      max_salary: data.max_salary.trim(),
      id,
    });
    if (result.rowsAffected === 0) return null;
    return this.findById(id);
  },

  async remove(id) {
    const sql = `
      DELETE FROM jobs
      WHERE  job_id = :id
    `;
    const result = await query(sql, { id });
    return result.rowsAffected > 0;
  },
};

module.exports = JobRepository;
