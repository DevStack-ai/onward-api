
module.exports = (sequelize, type) => {
    return sequelize.define('containers', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        uid: type.STRING,
        reference: type.STRING,
        reference_alt: type.STRING,
        source: type.STRING,
        company: type.STRING,
        source: type.STRING,
        docto_no: type.STRING,
        customer: type.STRING,
        status_bpo: type.STRING,
        bpo_livemapurl: type.STRING,
        Status: type.STRING,
        LiveMapUrl: type.STRING,
        order_time: type.STRING,
        close_date: type.STRING,
        checkout_date: type.STRING,
        departure_data: type.STRING,
        trans_type: type.STRING,
        entry_number: type.STRING,
        total_amount: type.STRING,
        fda: type.STRING,
        cbp: type.STRING,
        usda: type.STRING,
        lfd: type.STRING,
        lfd_fee: type.STRING,
        estimated_date: type.STRING,
        delivery_date: type.STRING,
        obs: type.STRING,
        container: type.STRING,
        ContainerNumber: type.STRING,
        Message: type.STRING,
        StatusId: type.STRING,
        ReferenceNo: type.STRING,
        ShippingLine: type.STRING,
        FromCountry: type.STRING,
        Pol: type.STRING,
        Pod: type.STRING,
        Vessel: type.STRING,
        VesselIMO: type.STRING,
        GateOutDate: type.STRING,
        FormatedTransitTime: type.STRING,
        last_api_request: type.STRING, 
    })
};

