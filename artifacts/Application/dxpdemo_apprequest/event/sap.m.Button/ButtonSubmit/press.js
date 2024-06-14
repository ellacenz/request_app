var formData = modelSimpleForm.getData();

var options = {
    data: formData
};

apiAPI_save(options);

modelSimpleForm.setData({});

// Use MessageToast
sap.m.MessageToast.show("Request has been Submitted");