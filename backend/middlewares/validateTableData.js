const validateTableData = (req, res, next) => {
    const { name, today, yesterday } = req.body;
    if (!name || typeof name !== 'string' || !today || !yesterday) {
        return res.status(400).json({ message: 'Missing or invalid required fields' });
    }
    next();
};

export default validateTableData;
