d3.json("data/data.json").then(function(data) {
  const coursesLayout = data.courses_layout1;
  const requisitesLayout = data.requisites_layout1;
  const courses = data.courses;
  const requisites = data.requisites;
  const layouts = data.layouts;

  var width = parseInt(d3.select("#coursemap").style("width"));
  var height = width/1.8, scale = width/18;
  var xcoord = x => x * scale + width / 2;
  var ycoord = y => height - y * scale - 1.5*scale;
  var svg = d3.select("#coursemap svg").attr("width",width).attr("height",height);

  var requisiteLines = svg.append("g");
  var courseNodes = svg.append("g");
  var courseNumbers = svg.append("g");
  var infoNodes = svg.append("g");
  renderLayout(layouts[0]);

  var courseInfoDiv = d3.select("#courseinfobox").select("div").style("display","none");
  var courseInfoString = d3.select("#course-info-string").html();
  var courseInfoTemplate = _.template(courseInfoString);

  var layoutDivs = d3.select("#trackinfobox").selectAll("div").data(layouts).join("div")
                     .html(layout => layout.name).on("click",(e,d) => renderLayout(d));

  function showCourseInfo (event,course) {
    var courseInfo = courses.find(d => d.number == course.course_number);
    var requisiteInfo = requisites.filter(r => r.course_number == course.course_number);
    var courseInfoObject = {"number": courseInfo.number,
                            "title": courseInfo.title,
                            "description": courseInfo.description,
                            "prereqs": requisiteInfo.filter(requisite => requisite.type == "pre"),
                            "coreqs": requisiteInfo.filter(requisite => requisite.type == "co")};
    courseInfoDiv.html(courseInfoTemplate(courseInfoObject)).style("display","block");
    requisiteLines.selectAll("line").filter(requisite => requisite.course_number == course.course_number).attr("opacity",1);
  };

  function hideCourseInfo (event,course) {
    requisiteLines.selectAll("line").filter(requisite => requisite.course_number == course.course_number)
                  .attr("opacity",requisite => requisite.requisite_is_primary == 1 ? 0.2 : 0);
  };

  function renderLayout (layout) {
    var newCoursesLayout = data["courses_layout" + layout.id];
    var newRequisitesLayout = data["requisites_layout" + layout.id];
    const t = svg.transition().duration(750);
    requisiteLines.selectAll("line").data(newRequisitesLayout,requisite => requisite.course_requisite_number)
                  .join("line")
                  .transition(t)
                  .attr("x1",requisite => xcoord(requisite.course_x)).attr("y1",requisite => ycoord(requisite.course_y))
                  .attr("x2",requisite => xcoord(requisite.requisite_x)).attr("y2",requisite => ycoord(requisite.requisite_y))
                  .attr("stroke","black").attr("opacity",requisite => requisite.requisite_is_primary == 1 ? 0.2 : 0);

    courseNodes.selectAll("circle").data(newCoursesLayout,course => course.course_number)
               .join("circle")
               .transition(t)
               .attr("cx",course => xcoord(course.x)).attr("cy",course => ycoord(course.y))
               .attr("r",9).attr("fill","white").attr("stroke","black");

    courseNumbers.selectAll("text").data(newCoursesLayout,d => d.course_number)
                 .join("text")
                 .transition(t)
                 .attr("x",course => xcoord(course.x)).attr("y",course => ycoord(course.y))
                 .attr("text-anchor","middle").attr("dy","2.5px")
                 .attr("font-color","black").attr("font-family","Arial").attr("font-size",8)
                 .text(d => d.course_number);

    infoNodes.selectAll("circle").data(newCoursesLayout,d => d.course_number)
             .join("circle")
             .attr("r", 9).style("opacity","0").on("mouseover",showCourseInfo).on("mouseout",hideCourseInfo)
             .transition(t)
             .attr("cx",course => xcoord(course.x)).attr("cy",course => ycoord(course.y));
  };
});
