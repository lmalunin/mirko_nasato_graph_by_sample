const db = require('./db');

const Query = {
    company: (root, { id }) => db.companies.get(id),
    job: (root, { id }) => db.jobs.get(id),
    jobs: () => db.jobs.list()
}

const Mutation = {
    createJob: (root, { input }, { userId }) => {

        const user = db.users.get(userId);

        const id = db.jobs.create({ companyId: user.companyId, ...input });
        return db.jobs.get(id);
    }
}

const Company = {
    jobs: (company) => db.jobs.list()
        .filter(job => job.companyId == company.id)
};

const Job = {
    company: (job) => db.companies.get(job.companyId)
}

module.exports = { Query, Job, Company, Mutation };