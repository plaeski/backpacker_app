// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

$(go);
$(document).on('page:load', go);


function go(){

  // drawing canvas pie with table
  // window.onload = function() {

  //   (function() { // keep the global space clean

  //     ////// STEP 0 - SETUP

  //     // source data table and canvas tag
  //     var data_table = document.getElementById('mydata');
  //     var canvas = document.getElementById('canvas');
  //     var td_index = 1; // which TD contains the data


  //     ////// STEP 1 - GET THE DATA

  //     // get the data[] from the table
  //     var tds, data = [], color, colors = [], value = 0, total = 0;
  //     var trs = data_table.getElementsByTagName('tr'); // all TRs
  //     for (var i = 0; i < trs.length; i++) {
  //       tds = trs[i].getElementsByTagName('td'); // all TDs

  //       if (tds.length === 0) continue; //  no TDs here, move on

  //       // get the value, update total
  //       value  = parseFloat(tds[td_index].innerHTML);
  //       data[data.length] = value;
  //       total += value;

  //       // random color
  //       color = getColor();
  //       colors[colors.length] = color; // save for later
  //       trs[i].style.backgroundColor = color; // color this TR
  //     }

  //     ////// STEP 2 - DRAW PIE ON CANVAS

  //     // exit if canvas is not supported
  //     if (typeof canvas.getContext === 'undefined') {
  //       return;
  //     }

  //     // get canvas context, determine radius and center
  //     var ctx = canvas.getContext('2d');
  //     var canvas_size = [canvas.width, canvas.height];
  //     var radius = Math.min(canvas_size[0], canvas_size[1]) / 2;
  //     var center = [canvas_size[0]/2, canvas_size[1]/2];

  //     var sofar = 0; // keep track of progress
  //     // loop the data[]
  //     for (var piece in data) {

  //       var thisvalue = data[piece] / total;

  //       ctx.beginPath();
  //       ctx.moveTo(center[0], center[1]); // center of the pie
  //       ctx.arc(  // draw next arc
  //         center[0],
  //         center[1],
  //         radius,
  //         Math.PI * (- 0.5 + 2 * sofar), // -0.5 sets set the start to be top
  //         Math.PI * (- 0.5 + 2 * (sofar + thisvalue)),
  //         false
  //       );

  //       ctx.lineTo(center[0], center[1]); // line back to the center
  //       ctx.closePath();
  //       ctx.fillStyle = colors[piece];    // color
  //       ctx.fill();

  //       sofar += thisvalue; // increment progress tracker
  //     }

  //     /////// DONE!

  //     // utility - generates random color
  //     function getColor() {
  //       var rgb = [];
  //       for (var i = 0; i < 3; i++) {
  //           rgb[i] = Math.round(100 * Math.random() + 155) ; // [155-255] = lighter colors
  //       }
  //       return 'rgb(' + rgb.join(',') + ')';
  //     }

  //   })() // exec!

  // } // close function window.onload



  function addTableRow(jQtable, rowData) {

    jQtable.each(function () {

      var $table = $(this);
      var tds = '<tr>';

      rowData.forEach(function(item) {
        tds += '<td>';
        tds += item;
        tds += '</td>';
      });

      tds += '</tr>';

      if ($('tbody', this).length > 0) {
        $('tbody', this).append(tds);
      } else {
        $(this).append(tds);
      }
    });
  }

  function removeTableRow(jQtable) {
    jQtable.each(function () {
      if ($('tbody', this).length > 0) {
        $('tbody tr', this).remove();
      }
    });
  }


  // output for option 1

  $('#output1').on('click',function(e){
    e.preventDefault();
    e.stopPropagation();

    var values = {};
    $.each($("#budgets_form1").serializeArray(), function (i, field) {
        values[field.name] = field.value;
    });

    $.ajax({
      url: $('#budgets_form1').attr('action'),
      type: 'POST',
      data: values,
      dataType: 'json',
    }).done(function(data) {

      country_name = $.parseJSON(data.country_name);
      result = $.parseJSON(data.result);
      percent = $.parseJSON(data.percent);
      others = $.parseJSON(data.fun_info);

      // text
      $('#outputbox1').text('');
      $('#outputbox1').append("<p>You can travel to <b>" + country_name + "</b> about <b>" + result[0] + " ~ " + result[1] + "</b> days!<br><br></p>");

      // fun table
      removeTableRow($('#myFunTable1'));
      others.forEach(function(i){
        addTableRow($('#myFunTable1'), i);
      });
      $('#myFunTable1').css("display", "block");

      // table
      $('#mypie1').text('');
      // $('#mypie1').append("<canvas id='canvas1' width='200' height='200'></canvas>");
      $('#mypie1').append("<table id='mydata1'><tr><th>Type of Expenses</th><th>Percentage</th></tr><tr><td>Accomodation</td><td>" + percent[0] + "%</td></tr><tr><td>Food</td><td>" + percent[1] + "%</td></tr><tr><td>Local Transporation</td><td>" + percent[2] + "%</td></tr><tr><td>Alcohol</td><td>" + percent[3] + "%</td></tr></table>");
      $('#mypie1').append("<br>* <b>" + result[0] + " ~ " + result[1] + "</b> days are calculated based on table above.");
    });

  });


  // output for option 2

  $('#output2').on('click',function(e){
    e.preventDefault();
    e.stopPropagation();

    var values = {};
    $.each($("#budgets_form2").serializeArray(), function (i, field) {
        values[field.name] = field.value;
    });

    $.ajax({
      url: $('#budgets_form2').attr('action'),
      type: 'POST',
      data: values,
      dataType: 'json',
    }).done(function(data) {

      country_name = $.parseJSON(data.country_name);
      budget = $.parseJSON(data.result);
      percent = $.parseJSON(data.percent);
      others = $.parseJSON(data.fun_info);

      // text
      $('#outputbox2').text('');
      $('#outputbox2').append("<p>To visit <b>" + country_name + "</b>, you need at least <b>$" + budget + "</b>.<br><br></p>");

      // table
      $('#mypie2').text('');
      // $('#mypie2').append("<canvas id='canvas2' width='200' height='200'></canvas>");
      $('#mypie2').append("<table id='mydata2'><tr><th>Type of Expenses</th><th>Percentage</th></tr><tr><td>Accomodation</td><td>" + percent[0] + "%</td></tr><tr><td>Food</td><td>" + percent[1] + "%</td></tr><tr><td>Local Transporation</td><td>" + percent[2] + "%</td></tr><tr><td>Alcohol</td><td>" + percent[3] + "%</td></tr></table>");
      $('#mypie2').append("<br>* <b>$" + budget + "</b> is based on the table above.");

      // fun table
      removeTableRow($('#myFunTable2'));
      others.forEach(function(i){
        addTableRow($('#myFunTable2'), i);
      });
      $('#myFunTable2').css("visibility", "visible");

    });

  });


  // output for option 3
  // this takes some times due to google_currency method

  // $('#output3').on('click',function(e){
  //   e.preventDefault();
  //   e.stopPropagation();

  //   var values = {};
  //   $.each($("#budgets_form3").serializeArray(), function (i, field) {
  //       values[field.name] = field.value;
  //   });

  //   $.ajax({
  //     url: $('#budgets_form3').attr('action'),
  //     type: 'POST',
  //     data: values,
  //     dataType: 'json',
  //   }).done(function(data) {

  //     country_name = $.parseJSON(data.country_name);

  //     // text
  //     $('#outputbox3').text('');
  //     $('#outputbox3').append("<p>Our suggested countries: <b>" + country_name + "</b><br><br></p>");

  //     // table
  //     $('#mypie3').text('');
  //     $('#mypie3').append("<canvas id='canvas3' width='200' height='200'></canvas>");
  //     // $('#mypie3').append("<table id='mydata3'><tr><th>Type of Expenses</th><th>Percentage</th></tr><tr><td>Accomodation</td><td>" + percent[0] + "%</td></tr><tr><td>Food</td><td>" + percent[1] + "%</td></tr><tr><td>Local Transporation</td><td>" + percent[2] + "%</td></tr><tr><td>Alcohol</td><td>" + percent[3] + "%</td></tr></table>");

  //     // for (i = 0; i < data.length; i++) {
  //     //   $('#outputbox3').append(data[i]);
  //     // }
  //   });

  // });

}  // close function go()
