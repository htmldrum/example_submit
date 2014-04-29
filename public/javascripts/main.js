$( window ).load( function(){

  $( 'input#submit' ).click( function( event ){

    if( $('input').filter('[type=checkbox]').is( ':checked' ) ){

      event.preventDefault();

      var reader = new FileReader();
      reader.onload = function( e ){

        $.ajax({
          url         : '/json_submit',
          data        : JSON.stringify( { b64 : e.target.result } ),
          type        : "POST",
          success     : function( data ){

            alert( 'posted!' );

          }.bind( this ),
          error       : function( err ){ 

            alert( 'Fuuuuck, man. Mega fail.' );
          
          }.bind( this ),
          processData : false
        });

      };

      reader.readAsDataURL( document.getElementById( 'image' ).files[0] );

    } else {

      // Multipart form takes care of image details

    }

  });

} );
