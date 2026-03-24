exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('training_registrations', {
        id: 'id',
        full_name: { type: 'varchar(255)', notNull: true },
        phone: { type: 'varchar(20)', notNull: true },
        email: { type: 'varchar(255)' },
        training_topic: { type: 'varchar(255)', notNull: true },
        preferred_date: { type: 'date' },
        location: { type: 'varchar(255)' },
        notes: { type: 'text' },
        status: { type: 'varchar(50)', notNull: true, default: 'pending' },
        created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
        updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
    });

    pgm.createTable('farm_visit_bookings', {
        id: 'id',
        requester_name: { type: 'varchar(255)', notNull: true },
        phone: { type: 'varchar(20)', notNull: true },
        email: { type: 'varchar(255)' },
        visit_type: { type: 'varchar(50)', notNull: true },
        farm_location: { type: 'varchar(255)', notNull: true },
        preferred_date: { type: 'date' },
        purpose: { type: 'text' },
        status: { type: 'varchar(50)', notNull: true, default: 'pending' },
        created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
        updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
    });

    pgm.createConstraint('farm_visit_bookings', 'farm_visit_bookings_visit_type_check', {
        check: "visit_type IN ('visit_my_farm', 'visit_your_farm')"
    });

    pgm.createTable('business_plans', {
        id: 'id',
        title: { type: 'varchar(255)', notNull: true },
        summary: { type: 'text', notNull: true },
        content: { type: 'text', notNull: true },
        category: { type: 'varchar(100)', notNull: true },
        document_url: { type: 'varchar(500)' },
        is_published: { type: 'boolean', notNull: true, default: false },
        created_by: { type: 'integer', references: 'users(id)', onDelete: 'set null' },
        created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
        updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
    });

    pgm.createIndex('training_registrations', ['status']);
    pgm.createIndex('farm_visit_bookings', ['status']);
    pgm.createIndex('business_plans', ['is_published']);
};

exports.down = (pgm) => {
    pgm.dropTable('business_plans');
    pgm.dropConstraint('farm_visit_bookings', 'farm_visit_bookings_visit_type_check');
    pgm.dropTable('farm_visit_bookings');
    pgm.dropTable('training_registrations');
};
