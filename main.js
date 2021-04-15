d3.json("data/data.json").then(function(data) {
  const coursesProgram = data.courses_program1;
  const requisitesProgram = data.requisites_program1;
  const courses = data.courses;
  const requisites = data.requisites;
  const programs = data.programs;
  const tracks = data.tracks;

  var width = parseInt(d3.select("#course-map").style("width"));
  var height = parseInt(d3.select("#course-map").style("height"));
  var scale = Math.min(width/18,height/10);
  var xcoord = x => x * scale + width / 2;
  var ycoord = y => height - y * scale - 1.5*scale;
  var svg = d3.select("#course-map svg").attr("width",width).attr("height",height);

  var requisiteLines = svg.append("g");
  var courseNodes = svg.append("g");
  var courseNumbers = svg.append("g");
  var infoNodes = svg.append("g");

  var programNav = d3.select("#program-nav").selectAll("div").data(programs).join("div")
                     .html(program => program.name)
                     .on("click", function (e,d) {
                       renderProgram(d);
                       showProgramInfo(d);
                     });
  var trackNav = d3.select("#track-nav").selectAll("div").data(tracks).join("div")
                   .html(track => track.name).on("click",(e,d) => showProgramInfo(d));

  var programInfoDiv = d3.select("#program-info");
  var programInfoHTML = d3.select("#program-info-template").html();
  var programInfoTemplate = _.template(programInfoHTML);
  function showProgramInfo (program) {
    programInfoDiv.html(programInfoTemplate(program));
  };

  var courseInfoDiv = d3.select("#course-info").select("div").style("display","none");
  var courseInfoHTML = d3.select("#course-info-template").html();
  var courseInfoTemplate = _.template(courseInfoHTML);
  function showCourseInfo (event,course) {
    var courseInfo = courses.find(d => d.number == course.course_number);
    var requisiteInfo = requisites.filter(r => r.course_number == course.course_number);
    var courseInfoObject = {"number": courseInfo.number,
                            "title": courseInfo.title,
                            "description": courseInfo.description,
                            "prereqs": requisiteInfo.filter(requisite => requisite.type == "pre"),
                            "coreqs": requisiteInfo.filter(requisite => requisite.type == "co"),
                            "notes": courseInfo.notes};
    courseInfoDiv.html(courseInfoTemplate(courseInfoObject)).style("display","block");
    requisiteLines.selectAll("line").filter(requisite => requisite.course_number == course.course_number).attr("opacity",1);
  };

  function hideCourseInfo (event,course) {
    requisiteLines.selectAll("line").filter(requisite => requisite.course_number == course.course_number)
                  .attr("opacity",requisite => requisite.requisite_is_primary == 1 ? 0.2 : 0);
  };

  function renderProgram (program) {
    var newCoursesProgram = data["courses_program" + program.id];
    var newRequisitesProgram = data["requisites_program" + program.id];
    const t = svg.transition().duration(750);
    requisiteLines.selectAll("line").data(newRequisitesProgram,requisite => requisite.course_requisite_number)
                  .join("line")
                  .transition(t)
                  .attr("x1",requisite => xcoord(requisite.course_x)).attr("y1",requisite => ycoord(requisite.course_y))
                  .attr("x2",requisite => xcoord(requisite.requisite_x)).attr("y2",requisite => ycoord(requisite.requisite_y))
                  .attr("stroke","black").attr("opacity",requisite => requisite.requisite_is_primary == 1 ? 0.2 : 0);

    courseNodes.selectAll("circle").data(newCoursesProgram,course => course.course_number)
               .join("circle")
               .transition(t)
               .attr("cx",course => xcoord(course.x)).attr("cy",course => ycoord(course.y))
               .attr("r",9).attr("fill","white").attr("stroke","black");

    courseNumbers.selectAll("text").data(newCoursesProgram,d => d.course_number)
                 .join("text")
                 .transition(t)
                 .attr("x",course => xcoord(course.x)).attr("y",course => ycoord(course.y))
                 .attr("text-anchor","middle").attr("dy","2.5px")
                 .attr("font-color","black").attr("font-family","Arial").attr("font-size",8)
                 .text(d => d.course_number);

    infoNodes.selectAll("circle").data(newCoursesProgram,d => d.course_number)
             .join("circle")
             .attr("r", 9).style("opacity","0").on("mouseover",showCourseInfo).on("mouseout",hideCourseInfo)
             .transition(t)
             .attr("cx",course => xcoord(course.x)).attr("cy",course => ycoord(course.y));
  };

  renderProgram(programs[0]);
  showProgramInfo(programs[0]);

});
