module.exports = (req, res, next) => {
	if(req.user) {
		var {admin} = req.user
	}
	if(admin) {
		next()
	} else {
		res.status(401).json({ msg: 'No estas autorizado para ver esta página' });
	}
};