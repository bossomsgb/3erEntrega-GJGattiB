// Para probar la targeta: 4: VISA, 51 -> 55: MasterCard, 36-38-39: DinersClub, 34-37: American Express, 65: Discover, 5019: dankort


$(function(){
  
    let cards = [{
      nome: "mastercard",
      color: "#0061A8",
      src: "https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
    }, {
      nome: "visa",
      color: "#E2CB38",
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2000px-Visa_Inc._logo.svg.png"
    }, {
      nome: "dinersclub",
      color: "#888",
      src: "http://www.worldsultimatetravels.com/wp-content/uploads/2016/07/Diners-Club-Logo-1920x512.png"
    }, {
      nome: "americanExpress",
      color: "#108168",
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/American_Express_logo.svg/600px-American_Express_logo.svg.png"
    }, {
      nome: "discover",
      color: "#86B8CF",
      src: "https://lendedu.com/wp-content/uploads/2016/03/discover-it-for-students-credit-card.jpg"
    }, {
      nome: "dankort",
      color: "#0061A8",
      src: "https://upload.wikimedia.org/wikipedia/commons/5/51/Dankort_logo.png"
    }];
    
    let month = 0;
    let html = document.getElementsByTagName('html')[0];
    let number = "";
    
    let selected_card = -1;
    
    $(document).click(function(e){
      

      if(!$(e.target).is(".ccv") || !$(e.target).closest(".ccv").length){
        $(".card").css("transform", "rotatey(0deg)");
        $(".seccode").css("color", "let(--text-color)");
      }
      if(!$(e.target).is(".expire") || !$(e.target).closest(".expire").length){
        $(".date_value").css("color", "let(--text-color)");
      }
      if(!$(e.target).is(".number") || !$(e.target).closest(".number").length){
        $(".card_number").css("color", "let(--text-color)");
      }
      if(!$(e.target).is(".inputname") || !$(e.target).closest(".inputname").length){
        $(".fullname").css("color", "let(--text-color)");
      }
    });
    
    
    //Numero de tarjeta input
    $(".number").keyup(function(e){
      $(".card_number").text($(this).val());
      number = $(this).val();
      
      if(parseInt(number.substring(0, 2)) > 50 && parseInt(number.substring(0, 2)) < 56){
        selected_card = 0;
      }else if(parseInt(number.substring(0, 1)) == 4){
        selected_card = 1;  
      }else if(parseInt(number.substring(0, 2)) == 36 || parseInt(number.substring(0, 2)) == 38 || parseInt(number.substring(0, 2)) == 39){
        selected_card = 2;     
      }else if(parseInt(number.substring(0, 2)) == 34 || parseInt(number.substring(0, 2)) == 37){
        selected_card = 3; 
      }else if(parseInt(number.substring(0, 2)) == 65){
        selected_card = 4; 
      }else if(parseInt(number.substring(0, 4)) == 5019){
        selected_card = 5; 
      }else{
        selected_card = -1; 
      }
      
      if(selected_card != -1){
        html.setAttribute("style", "--card-color: " + cards[selected_card].color);  
        $(".bankid").attr("src", cards[selected_card].src).show();
      }else{
        html.setAttribute("style", "--card-color: #cecece");
        $(".bankid").attr("src", "").hide();
      }
      
      if($(".card_number").text().length === 0){
        $(".card_number").html("&#x25CF;&#x25CF;&#x25CF;&#x25CF; &#x25CF;&#x25CF;&#x25CF;&#x25CF; &#x25CF;&#x25CF;&#x25CF;&#x25CF; &#x25CF;&#x25CF;&#x25CF;&#x25CF;");
      }
  
    }).focus(function(){
      $(".card_number").css("color", "white");
    }).on("keydown input", function(e){
      
      $(".card_number").text($(this).val());
      
      if(e.key >= 0 && e.key <= 9){
        if($(this).val().length === 4 || $(this).val().length === 9 || $(this).val().length === 14){
          $(this).val($(this).val() +  " ");
        }
      }
    })
    
    //Nombre Input
    $(".inputname").keyup(function(e){  
      $(".fullname").text($(this).val());  
      if($(".inputname").val().length === 0){
          $(".fullname").text("TITULAR");
      }
      return e.charCode;
    }).focus(function(){
      $(".fullname").css("color", "white");
    });
    
    //Codigo seguridad Input
    $(".ccv").focus(function(){
      $(".card").css("transform", "rotatey(180deg)");
      $(".seccode").css("color", "white");
    }).keyup(function(){
      $(".seccode").text($(this).val());
      if($(this).val().length === 0){
        $(".seccode").html("&#x25CF;&#x25CF;&#x25CF;");
      }
    }).focusout(function() {
        $(".card").css("transform", "rotatey(0deg)");
        $(".seccode").css("color", "let(--text-color)");
    });
      
    
    //Vencimiento input
    $(".expire").keypress(function(e){
      if(e.charCode >= 48 && e.charCode <= 57){
        if($(this).val().length === 1){
            $(this).val($(this).val() + e.key + " / ");
        }else if($(this).val().length === 0){
          if(e.key == 1 || e.key == 0){
            month = e.key;
            return e.charCode;
          }else{
            $(this).val(0 + e.key + " / ");
          }
        }else if($(this).val().length > 2 && $(this).val().length < 9){
          return e.charCode;
        }
      }
      return false;
    }).keyup(function(e){
      $(".date_value").html($(this).val());
      if(e.keyCode == 8 && $(".expire").val().length == 4){
        $(this).val(month);
      }
      
      if($(this).val().length === 0){
        $(".date_value").text("MM / YYYY");
      }
    }).keydown(function(){
      $(".date_value").html($(this).val());
    }).focus(function(){
      $(".date_value").css("color", "white");
    });
  });
