// generate with ./bin/console fos:js-routing:dump --format=json --target=assets/js/routes/fos_js_routes.json
const routes = require('../../js/routes/fos_js_routes.json');
const Routing = require('../../../vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router');
Routing.setRoutingData(routes);
export default Routing;