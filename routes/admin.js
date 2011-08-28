var output = require('../output'),
    adminForm = {
      "fid":"editor",
      "fields":[
        {"type":"radio", "name":"createtype", "value":"article", "label":"Create article"},
        {"type":"radio", "name":"createtype", "value":"link", "label":"Create link"},
        {"type":"text", "id":"createtitle", "value":"", "label":"Title"},
        {"type":"text", "id":"createdescription", "value":"", "label":"Description"},        
        {"type":"text", "id":"createcategory", "value":"", "label":"Category", "after":{"el":"div","id":"input"}},
        {"type":"textarea", "id":"updateText", "rows":"50", "cols":"80", "content":""},
        {"type":"submit", "value":"Save"}
      ]
    },
    content = {
      template:"admin.html",
      data: {
        js: [{filename:"/js/admin.js"}],
        stylesheets: [{"stylesheet":"/styles/admin.css"}],
        adminForm: adminForm        
      }
    };

module.exports = function(app) {
  app.get('/',function(req,res) {
    content.data.adminForm.itemId = null;
    output(req,res,content);
  });

  app.get('/:type/:id',function(req,res) {
    content.data.adminForm.itemId = req.params.id;
    
    var mainKey = req.params.type + ":" + req.params.id + ":",
        key = mainKey;
    
    if (req.params.type == "link") {
      key += "text";
    } else if (req.params.type == "article") {
      key += "content";
    }
    
    client.get(key, function(err, ct) {
      if (req.params.type == "link") {
        if (!ct) { ct = ""; }
        client.get(mainKey + "uri", function (err, uri) {          
          if (uri) {
            ct = uri + "\n\n" + ct;
          }
          content.data.adminForm.fields[4].content = ct;
          output(req,res,content);      
        });
      } else {
        if (ct) { content.data.adminForm.fields[4].content = ct; } else { content.data.adminForm.fields[4].content = ""; }
        output(req,res,content);      
      }
    });
  });
  
};