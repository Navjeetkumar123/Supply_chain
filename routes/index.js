module.exports = function(app) {

    app.all("/login",function(req, res, next) {
        res.render('login');
    });
    
    app.all("/supplier_index",function(req, res, next) {
        res.render('supplier_index');
    });

    app.all("/manufacturer_index",function(req, res, next) {
        res.render('manufacturer_index');
    });
   
    app.all("/logistics_index",function(req, res, next) {
        res.render('logistics_index');
    });
    
    app.all("/distributor_index",function(req, res, next) {
        res.render('distributor_index');
    });
   
    app.all("/retailer_index",function(req, res, next) {
        res.render('retailer_index');
    });
    app.all("/explorer",function(req, res, next) {
        res.render('explorer');
    });
   
    app.all("/",function(req, res, next) {
        res.render('login');
    });
    
}
