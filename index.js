module.exports = process.env.COV ? 
				require('./lib-cov/implement') : require('./lib/implement');
