d3.json("data/data.json").then(function(data) {
  const courses = data.courses;
  const requisites = data.requisites;
  const programs = data.programs;
  const tracks = data.tracks;
  const coursesTracks = data.courses_tracks;

  var width = parseInt(d3.select("#course-map").style("width")) - 20;
  var height = parseInt(d3.select("#course-map").style("height")) - 20;
  var scale = Math.min(width/18,height/10);
  var xcoord = x => x * scale + width / 2;
  var ycoord = y => height - y * scale - 1.5*scale;
  var svg = d3.select("#course-map svg").attr("width",width).attr("height",height);
  var highlightColor1 = "rgb(0, 85, 183)";

  var requisiteLines = svg.append("g");
  var courseNodes = svg.append("g");
  var courseNumbers = svg.append("g");
  var infoNodes = svg.append("g");

  var programNav = d3.select("#program-nav")
    .selectAll("div")
    .data(programs)
    .join("div")
    .html(program => program.name)
    .on("click",function (event,program) {
      d3.select("#program-nav div.highlight").classed("highlight",false);
      d3.select("#track-nav div.highlight").classed("highlight",false);
      d3.select(this).classed("highlight",true);
      renderProgram(program,600);
      showInfo(program);
      highlight(null);
    });

  var trackNav = d3.select("#track-nav")
    .selectAll("div")
    .data(tracks)
    .join("div")
    .html(track => track.name)
    .on("click", function (event,track) {
      d3.select("#track-nav div.highlight").classed("highlight",false);
      d3.select(this).classed("highlight",true);
      var coursesTrack = coursesTracks.filter(d => d.track_id == track.track_id).map(d => d.course_number);
      showInfo(track);
      highlight(coursesTrack);
    })
    .style("display","none");

  var programInfoDiv = d3.select("#program-info");
  var programInfoHTML = d3.select("#program-info-template").html();
  var programInfoTemplate = _.template(programInfoHTML);

  var courseInfoDiv = d3.select("#course-info").select("div");
  var courseInfoHTML = d3.select("#course-info-template").html();
  var courseInfoTemplate = _.template(courseInfoHTML);

  function showInfo (program) {
    programInfoDiv.html(programInfoTemplate(program));
  };

  function showCourseInfo (event,course) {
    var courseInfo = courses.find(d => d.number == course.course_number);
    var requisiteInfo = requisites.filter(r => r.course_number == course.course_number);
    var courseInfoObject = {"number": courseInfo.number,
                            "title": courseInfo.title,
                            "description": courseInfo.description,
                            "prereqs": requisiteInfo.filter(requisite => requisite.type == "pre"),
                            "coreqs": requisiteInfo.filter(requisite => requisite.type == "co"),
                            "notes": courseInfo.notes};
    courseInfoDiv.html(courseInfoTemplate(courseInfoObject));
    requisiteLines.selectAll("line")
      .filter(requisite => requisite.course_number == course.course_number).attr("opacity",1);
  };

  function hideCourseInfo (event,course) {
    requisiteLines
      .selectAll("line")
      .filter(requisite => requisite.course_number == course.course_number)
      .attr("opacity",requisite => requisite.requisite_is_primary == 1 ? 0.2 : 0);
  };

  function renderProgram (program,duration) {
    courseInfoDiv.html("");
    trackNav
      .transition()
      .duration(duration)
      .style("opacity",0)
      .style("display","none");
    trackNav
      .filter(d => d.program_id == program.program_id)
      .style("opacity",0)
      .transition()
      .delay(duration).duration(duration)
      .style("display","block")
      .style("opacity",1);
    var updateCoursesProgram = data["courses_program" + program.program_id];
    var updateRequisitesProgram = data["requisites_program" + program.program_id];

    courseNodes
      .selectAll("circle")
      .data(updateCoursesProgram,course => course.course_number)
      .join(function (enter) {
        enter.append("circle")
          .attr("r",9)
          .attr("fill","white")
          .attr("stroke","rgba(0,0,0,0)")
          .attr("opacity",0)
          .attr("cx",course => xcoord(course.x))
          .attr("cy",course => ycoord(course.y))
          .transition()
          .delay(2*duration).duration(duration)
          .style("opacity",1)
          .attr("fill",course => course.required ? highlightColor1 : "white")
          .attr("stroke",course => course.required ? highlightColor1 : "black");
      },function (update) {
        update
          .transition()
          .delay(duration).duration(duration)
          .attr("cx",course => xcoord(course.x))
          .attr("cy",course => ycoord(course.y))
          .attr("fill",course => course.required ? highlightColor1 : "white")
          .attr("stroke",course => course.required ? highlightColor1 : "black");
      },function (exit) {
        exit.transition()
          .duration(duration)
          .attr("fill","white")
          .attr("stroke","rgba(0,0,0,0)")
          .attr("opacity",0)
          .remove();
      });

    courseNumbers
      .selectAll("text")
      .data(updateCoursesProgram,course => course.course_number)
      .join(function (enter) {
        enter.append("text")
          .attr("x",course => xcoord(course.x))
          .attr("y",course => ycoord(course.y))
          .attr("text-anchor","middle").attr("dy","2.5px")
          .attr("font-family","Arial").attr("font-size",8)
          .attr("fill",course => course.required ? "white" : "black")
          .attr("opacity",0)
          .text(d => d.course_number)
          .transition()
          .delay(2*duration).duration(duration)
          .attr("opacity",1);
      },function (update) {
        update
          .attr("fill",course => course.required ? "white" : "black")
          .transition()
          .delay(duration).duration(duration)
          .attr("x",course => xcoord(course.x))
          .attr("y",course => ycoord(course.y));
      }, function (exit) {
        exit.transition()
          .duration(duration)
          .attr("fill","rgba(0,0,0,0)").remove();
      });

    infoNodes
      .selectAll("circle")
      .data(updateCoursesProgram,course => course.course_number)
      .join("circle")
      .attr("r", 9).style("opacity","0").style("stroke-opacity",0)
      .transition()
      .delay(duration).duration(duration)
      .attr("cx",course => xcoord(course.x))
      .attr("cy",course => ycoord(course.y));

    infoNodes
      .selectAll("circle")
      .on("mouseover",showCourseInfo)
      .on("mouseout",hideCourseInfo);

    requisiteLines
      .selectAll("line")
      .data(updateRequisitesProgram,requisite => requisite.course_requisite_number)
      .join(function (enter) {
        enter.append("line")
          .attr("x1",requisite => xcoord(requisite.course_x))
          .attr("y1",requisite => ycoord(requisite.course_y))
          .attr("x2",requisite => xcoord(requisite.requisite_x))
          .attr("y2",requisite => ycoord(requisite.requisite_y))
          .attr("stroke","black")
          .attr("opacity",0)
          .transition()
          .delay(2*duration).duration(duration)
          .attr("opacity",requisite => requisite.requisite_is_primary == 1 ? 0.2 : 0);
      },function (update) {
        update
          .transition()
          .delay(duration).duration(duration)
          .attr("x1",requisite => xcoord(requisite.course_x))
          .attr("y1",requisite => ycoord(requisite.course_y))
          .attr("x2",requisite => xcoord(requisite.requisite_x))
          .attr("y2",requisite => ycoord(requisite.requisite_y))
          .attr("opacity",requisite => requisite.requisite_is_primary == 1 ? 0.2 : 0);
      },function (exit) {
        exit.transition()
          .duration(duration)
          .attr("opacity",0).remove();
      });

  };

  function highlight (courseList) {
    courseNodes.selectAll("circle")
      .attr("fill",course => course.required ? highlightColor1 : "white")
      .attr("stroke",course => course.required ? highlightColor1 : "black")
      .filter(course => courseList ? courseList.includes(course.course_number) : false)
      .attr("fill",highlightColor1)
      .attr("stroke",highlightColor1);
    courseNumbers.selectAll("text")
      .attr("fill",course => course.required ? "white" : "black")
      .filter(course => courseList ? courseList.includes(course.course_number) : false)
      .attr("fill","white");
  };

  renderProgram(programs[0],0);
  showInfo(programs[0]);
  d3.select("#program-nav div:nth-child(1)").classed("highlight",true);
});
