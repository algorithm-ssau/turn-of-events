const logger = (req, res, next) => {
    const { method, path, body } = req;
    console.log(`[${new Date().toISOString()}] ${method} ${path}`, body ? `Body: ${JSON.stringify(body)}` : '');
    next();
};

module.exports = logger;
