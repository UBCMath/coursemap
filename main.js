d3.json("data/data.json").then(function(data) {
  const courses = data.courses;
  const requisites = data.requisites;
  const programs = data.programs;
  const tracks = data.tracks;
  const coursesTracks = data.courses_tracks;
  const reflections = data.reflections;

  var width = parseInt(d3.select("#course-map").style("width"));
  var height = parseInt(d3.select("#course-map").style("height")) - 20;
  var xscale = width/18;
  var yscale = height/10;
  var xcoord = x => x * xscale + width / 2;
  var ycoord = y => height - y * yscale - 1.5*yscale;
  var svg = d3.select("#course-map svg").attr("width",width).attr("height",height);
  var highlightColor1 = "rgb(0, 85, 183)";

  var requisiteLines = svg.append("g");
  var courseNodes = svg.append("g");
  var courseNumbers = svg.append("g");
  var infoNodes = svg.append("g");

  var courseMapDiv = d3.select("#course-map");
  var programInfoDiv = d3.select("#program-info");
  var programInfo1Div = d3.select("#program-info1");
  var programInfo1Template = _.template(d3.select("#program-info1-template").html());
  var programInfo2Div = d3.select("#program-info2");
  var programInfo2Template = _.template(d3.select("#program-info2-template").html());
  var programInfoMoreDiv = d3.select("#program-info-more");
  var programInfo1MoreDiv = d3.select("#program-info1-more");
  var programInfo1MoreTemplate = _.template(d3.select("#program-info1-more-template").html());
  var programInfo2MoreDiv = d3.select("#program-info2-more");
  var programInfo2MoreTemplate = _.template(d3.select("#program-info2-more-template").html());
  var courseInfoDiv = d3.select("#course-info");
  var courseInfoTemplate = _.template(d3.select("#course-info-template").html());
  
  d3.select("#show-more").on("click",function (event) {
    programInfoDiv.style("z-index","-1");
    programInfoMoreDiv.style("z-index","1");
  });

  d3.select("#show-less").on("click",function (event) {
    programInfoDiv.style("z-index","1");
    programInfoMoreDiv.style("z-index","-1");
  });

  var programNav = d3.select("#program-track-nav");
  programs.forEach(function(program){
    programNav.append("div").classed("program",true).html(program.name).on("click",function (event) {
      d3.select("#program-track-nav div.highlight").classed("highlight",false);
      d3.select(this).classed("highlight",true);
      renderProgram(program,[],600);
      programInfo1Div.html(programInfo1Template(program));
      var reflection = _.sample(reflections.filter(reflection => reflection.program_id == program.program_id));
      programInfo2Div.html(programInfo2Template(reflection));
      programInfo1MoreDiv.html(programInfo1MoreTemplate(program));
      programInfo2MoreDiv.html(programInfo2MoreTemplate(reflection));
      console.log(programInfo1MoreDiv.html());
    });
    tracks.filter(d => d.program_id == program.program_id).forEach(function(track){
      programNav.append("div").classed("track",true).html(track.name).on("click", function (event) {
        d3.select("#program-track-nav div.highlight").classed("highlight",false);
        d3.select(this).classed("highlight",true);
        var coursesTrack = coursesTracks.filter(d => d.track_id == track.track_id).map(d => d.course_number);
        renderProgram(program,coursesTrack,600);
        programInfo1Div.html(programInfo1Template(track));
        var reflection = _.sample(reflections.filter(reflection => reflection.track_id == track.track_id));
        programInfo2Div.html(programInfo2Template(reflection));
        programInfo1MoreDiv.html(programInfo1MoreTemplate(track));
        programInfo2MoreDiv.html(programInfo2MoreTemplate(reflection));
      });
    });
  });

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
    requisiteLines.selectAll("line").filter(requisite => requisite.course_number == course.course_number).attr("opacity",1);
  };

  function hideCourseInfo (event,course) {
    requisiteLines
      .selectAll("line")
      .filter(requisite => requisite.course_number == course.course_number)
      .attr("opacity",requisite => requisite.requisite_is_primary == 1 ? 0.2 : 0);
  };

  function renderProgram (program,courseList,duration) {
    var course0 = {"number": "",
                   "title": "Course Information",
                   "description": "The course map presents all MATH courses along with prerequisite/corequisite connections. Hover over a course to view the course description, a complete list of prerequisites/corequisites, credit exclusions and notes. Select progams and streams in the menu above.",
                   "prereqs": [],
                   "coreqs": [], 
                   "notes": ""};
    courseInfoDiv.html(courseInfoTemplate(course0));

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
          .attr("fill",course => (course.required || courseList.includes(course.course_number)) ? highlightColor1 : "white")
          .attr("stroke",course => (course.required || courseList.includes(course.course_number)) ? highlightColor1 : "black");
      },function (update) {
        update
          .attr("fill",course => (course.required || courseList.includes(course.course_number)) ? highlightColor1 : "white")
          .attr("stroke",course => (course.required || courseList.includes(course.course_number)) ? highlightColor1 : "black")
          .transition()
          .delay(duration).duration(duration)
          .attr("cx",course => xcoord(course.x))
          .attr("cy",course => ycoord(course.y));
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
          .attr("fill",course => (course.required || courseList.includes(course.course_number)) ? "white" : "black")
          .attr("opacity",0)
          .text(d => d.course_number)
          .transition()
          .delay(2*duration).duration(duration)
          .attr("opacity",1);
      },function (update) {
        update
          .attr("fill",course => (course.required || courseList.includes(course.course_number)) ? "white" : "black")
          .transition()
          .delay(duration).duration(duration)
          .attr("x",course => xcoord(course.x))
          .attr("y",course => ycoord(course.y));
      },function (exit) {
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

  renderProgram(programs[0],[],0);
  programInfo1Div.html(programInfo1Template(programs[0]));
  var reflection = _.sample(reflections.filter(reflection => reflection.program_id == 1));
  programInfo2Div.html(programInfo2Template(reflection));
  programInfo1MoreDiv.html(programInfo1MoreTemplate(programs[0]));
  programInfo2MoreDiv.html(programInfo2MoreTemplate(reflection));  
  d3.select("#program-track-nav div:nth-child(1)").classed("highlight",true);
});