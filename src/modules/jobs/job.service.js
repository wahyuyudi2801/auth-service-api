const JobRepository = require('./job.repository');
const JobModel = require('./job.model');
const AppError = require('../../shared/utils/AppError');

const JobService = {
    async getAll() {
        return JobRepository.findAll();
    },

    async getById(id) {
        const dept = await JobRepository.findById(id);
        if (!dept) throw new AppError(`Job dengan ID ${id} tidak ditemukan`, 404);
        return dept;
    },

    async create(data) {
        const { valid, errors } = JobModel.validate(data);
        if (!valid) throw new AppError('Validasi gagal', 422, errors);

        return JobRepository.create(data);
    },

    async update(id, data) {
        await this.getById(id);

        const { valid, errors } = JobModel.validate(data);
        if (!valid) throw new AppError('Validasi gagal', 422, errors);

        return JobRepository.update(id, data);
    },

    async remove(id) {
        await this.getById(id);
        const deleted = await JobRepository.remove(id);
        if (!deleted) throw new AppError('Gagal menghapus job', 500);
        return { job_id: id };
    },
};

module.exports = JobService;
