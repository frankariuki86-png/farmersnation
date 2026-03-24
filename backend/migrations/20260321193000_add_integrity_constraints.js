exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.alterColumn('blog_posts', 'slug', {
        notNull: true
    });

    pgm.createConstraint('marketplace_products', 'marketplace_products_price_positive', {
        check: 'price > 0'
    });

    pgm.createConstraint('marketplace_products', 'marketplace_products_stock_non_negative', {
        check: 'stock >= 0'
    });
};

exports.down = (pgm) => {
    pgm.dropConstraint('marketplace_products', 'marketplace_products_stock_non_negative');
    pgm.dropConstraint('marketplace_products', 'marketplace_products_price_positive');

    pgm.alterColumn('blog_posts', 'slug', {
        notNull: false
    });
};
