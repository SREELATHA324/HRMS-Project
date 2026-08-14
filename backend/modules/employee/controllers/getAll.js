const pool = require('../../../db');

async function getAllEmployees(req, res) {
    try {
        const { 
            department, status, search, role, jobLocation, 
            lengthOfService, page = 1, limit = 10 
        } = req.query;

        let query = `
            SELECT e.*, 
                    d.name as department_name,
                    des.name as designation_name,
                    CONCAT(m."firstName", ' ', m."lastName") as reporting_manager_name,
                    EXTRACT(YEAR FROM AGE(CURRENT_DATE, e."joiningDate")) as years_of_service,
                    EXTRACT(MONTH FROM AGE(CURRENT_DATE, e."joiningDate")) as months_of_service
            FROM employees e
            LEFT JOIN departments d ON e."departmentId" = d.id
            LEFT JOIN designations des ON e."designationId" = des.id
            LEFT JOIN employees m ON e."reportingManagerId" = m.id
            WHERE 1=1
        `;

        const params = [];
        let paramCount = 1;

        if (department) {
            query += ` AND e."departmentId" = $${paramCount}`;
            params.push(department);
            paramCount++;
        }

        if (status) {
            query += ` AND e.status = $${paramCount}`;
            params.push(status);
            paramCount++;
        }

        if (role) {
            query += ` AND e.role = $${paramCount}`;
            params.push(role);
            paramCount++;
        }

        if (jobLocation) {
            query += ` AND e."jobLocation" = $${paramCount}`;
            params.push(jobLocation);
            paramCount++;
        }

        if (search) {
            query += ` AND (
                e."firstName" ILIKE $${paramCount} OR 
                e."lastName" ILIKE $${paramCount} OR 
                e.email ILIKE $${paramCount} OR 
                e."employeeCode" ILIKE $${paramCount}
            )`;
            params.push(`%${search}%`);
            paramCount++;
        }

        if (lengthOfService) {
            const now = new Date();
            if (lengthOfService === 'less_than_1_year') {
                query += ` AND e."joiningDate" > $${paramCount}`;
                params.push(new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()));
                paramCount++;
            } else if (lengthOfService === '1_to_3_years') {
                query += ` AND e."joiningDate" BETWEEN $${paramCount} AND $${paramCount + 1}`;
                params.push(new Date(now.getFullYear() - 3, now.getMonth(), now.getDate()));
                params.push(new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()));
                paramCount += 2;
            } else if (lengthOfService === '3_to_5_years') {
                query += ` AND e."joiningDate" BETWEEN $${paramCount} AND $${paramCount + 1}`;
                params.push(new Date(now.getFullYear() - 5, now.getMonth(), now.getDate()));
                params.push(new Date(now.getFullYear() - 3, now.getMonth(), now.getDate()));
                paramCount += 2;
            } else if (lengthOfService === 'more_than_5_years') {
                query += ` AND e."joiningDate" < $${paramCount}`;
                params.push(new Date(now.getFullYear() - 5, now.getMonth(), now.getDate()));
                paramCount++;
            }
        }

        query += ` ORDER BY e.created_at DESC`;

        const offset = (parseInt(page) - 1) * parseInt(limit);
        query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
        params.push(parseInt(limit), offset);

        const result = await pool.query(query, params);

        const countResult = await pool.query('SELECT COUNT(*) FROM employees');
        const totalEmployees = parseInt(countResult.rows[0].count);

        const formattedData = result.rows.map(emp => {
            const years = parseInt(emp.years_of_service) || 0;
            const months = parseInt(emp.months_of_service) || 0;
            let lengthOfServiceDisplay = '';
            
            if (years === 0 && months === 0) {
                lengthOfServiceDisplay = '< 1 month';
            } else if (years === 0) {
                lengthOfServiceDisplay = `${months} month${months > 1 ? 's' : ''}`;
            } else if (months === 0) {
                lengthOfServiceDisplay = `${years} year${years > 1 ? 's' : ''}`;
            } else {
                lengthOfServiceDisplay = `${years} year${years > 1 ? 's' : ''} ${months} month${months > 1 ? 's' : ''}`;
            }

            return {
                ...emp,
                lengthOfService: lengthOfServiceDisplay
            };
        });

        res.status(200).json({
            success: true,
            data: formattedData,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalEmployees / parseInt(limit)),
                totalItems: totalEmployees,
                itemsPerPage: parseInt(limit)
            }
        });

    } catch (error) {
        console.error('Get employees error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = getAllEmployees;