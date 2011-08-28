(function(){
  var cachedText = '',
      newVal = 'new',
      selection = '';
      
  $(document).ready(function(){
    var admin = {
      "refreshPreview": function refreshPreview() {
        newVal = $("#updateText").val();        
        if (newVal != '' && newVal != cachedText) {
          $.ajax({
            url: "/md/return",
            type: "POST",
            data: {
              "str":escape(newVal)
            },
            success: function(data) {
              var d = JSON.parse(data);
              $("#preview").html(unescape(d.output));
              cachedText = newVal;
            },
            complete: function() {
              setTimeout(function(){admin.refreshPreview();},1000);                                
            }
          });        
        } else {
          setTimeout(function(){admin.refreshPreview();},1000);                                          
        }
      }
    };      

    admin.refreshPreview();

    $("#updateText").bind("mouseup", function() {
  	   	selection = getSelectedText(); 
    }); 

    $('a#boldIt').click(function(e){
      e.preventDefault();
      selection = '**'+selection+'**';
    });

    //Grab selected text
    function getSelectedText(){ 
        if(window.getSelection){ 
    		return window.getSelection().toString(); 
        } 
        else if(document.getSelection){ 
            return document.getSelection(); 
        } 
        else if(document.selection){ 

            return document.selection.createRange().text; 
        } 
    }    
    
    $('#editor').submit(function(e){
      e.preventDefault();
      $.ajax({
        url: "/md/save",
        type: "POST",
        data: {
          "title":$('#createtitle').val(),
          "id":$('#itemId').val() || null,
          "cat":$('#createcategory').val(),
          "description":$('#createdescription').val(),
          "type":$('input[@name=createtype]:checked').val(),
          "str":escape($("#updateText").val())
        },
        success: function(data) {
          $('body').css("background","green");
          setTimeout(function(){
            $('body').css("background","#fff");
          },5000);
        }
      });        
      
    });
    
  });
}());