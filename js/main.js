var url = 'http://pipes.yahoo.com/pipes/pipe.run?_id=c6b9f27dbbdfed8e30e5dc0a9b445bda&_render=json';
var ted = {};
ted.build = function(obj, inc){
  var category = obj.category;
  var description = obj.description;
  var speaker = obj["itunes:author"];
  var title = obj.title;
  var pubDate = obj.pubDate;
  var link = obj.link; 
  var img = obj["itunes:image"].url;
  var duration = obj["itunes:duration"];
  var video = obj.enclosure.url;
  var html = $('.template').clone().removeClass('template').attr('id','video-'+inc);
  $('.video-container').append(html);
  var _v = $('#video-'+inc);
  _v.addClass('video-item').attr('data-inc',inc).attr('data-img', img)
    .children('.video-title').text(title)
    .siblings('.video-speaker').text(speaker)
    .siblings('.video-description').text(description)
    .siblings('.video-link').attr('href',link).text('Watch '+speaker)
    ;
    

};
ted.getX = function(){
  var windowWidth = window.innerWidth || document.documentElement.clientWidth;
      var screenWidth = parseInt($('.video-item').css('width'))/2;
      var xPos = (windowWidth/2)-screenWidth;
      return xPos;
};
ted.previousPos = '-110%';
ted.nextPos = '110%';
ted.slide = function(moveScreen, showScreen){
  if(moveScreen != ""){
        $('.active').removeClass('active').animate({
            left: moveScreen
          }, 1000);
      };
     
      var bg  = $(showScreen).attr('data-img');
      $('body').css({
        background: 'url("'+bg+'") top left no-repeat',
        backgroundSize : '100%',
        transition: 'background 0.5s linear'});
      $('#current').text(parseInt($(showScreen).attr('data-inc'))+1);
      $(showScreen).addClass('active').delay(500).animate({
            left: ted.getX()}, 1000);
}
ted.move = function(dir){
  var slide_count = $('.video-item').length;
  var moveScreen = (dir ==  'next') ? ted.previousPos : ted.nextPos;
  var showScreen = (dir ==  'next') ? $('.active').next('.video-item') : $('.active').prev('.video-item');
  if(($('.active').hasClass('last') && dir == 'next') || ($('.active').hasClass('first') && dir == 'previous')){
    return false;
  } else {
    ted.slide(moveScreen,showScreen);
  }
}




$(function(){
  $.ajax({
    url :  url,
    context : document.body,
    dataType : 'json',
    crossDomain : true
  }).success(function(response){
    var obj = response.value.items;
    for(i=0; i< obj.length; i++){
      ted.build(obj[i],i)
    }
    $('#video-0').addClass('active').addClass('first');
    ted.slide('',$('#video-0'));
    $('#current').text(1);
    $('#total').text($('.video-item').length);
    $('.video-item:last-child').addClass('last');
  });
  $('nav a').on('click', function(e){
    e.preventDefault();
    var dir = $(this).attr('data-direction');
    ted.move(dir);
  });
  
});
