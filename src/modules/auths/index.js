const router = require('./auth.routes');

module.exports = { router };


/**
 * select u.user_id, u.username, u.full_name, r.role_id, r.role_name from users u 
JOIN user_roles ur ON u.user_id = ur.user_id
JOIN roles r ON r.role_id = ur.role_id;

select * from roles;
select * from permissions;
select * from role_permissions;
select * from user_roles;

SELECT permission_id, permission_code, module, action FROM permissions;
 */