// Date to get recent syllabus
var d = new Date();
var y = d.getFullYear();
var m = d.getMonth() + 1;

// Course information template
var courseInfoDiv = d3.select("#infobox").append("div").style("display", "none");
var courseInfoString = `<h2>MATH <%= number %></h2>
                            <h3><%= title %></h3>
                            <p><%= description %></p>
                            <% if (prereqs.length > 0) { %>
                              <h4>Prerequisites</h4>
                              <ul><% _.each(prereqs, function(prereq) { %><li><%= prereq.description %></li><% }); %></ul>
                            <% }; %>
                            <% if (coreqs.length > 0) { %>
                              <h4>Corequisites</h4>
                              <ul><% _.each(coreqs, function(coreq) { %><li><%= coreq.description %></li><% }); %></ul>
                            <% }; %>
                              <h4>Syllabus</h4>`
var courseInfoTemplate = _.template(courseInfoString);

function showCourseInfo(event, course, coursesInfo, requisitesInfo) {
    const course_num = course.attr("id");
    var courseInfo = coursesInfo.find(d => d.number == course_num);
    var requisiteInfo = requisitesInfo.filter(r => r.course_number == course_num);
    var courseInfoObject = {
        "number": courseInfo.number,
        "title": courseInfo.title,
        "description": courseInfo.description,
        "prereqs": requisiteInfo.filter(r => r.type == "pre"),
        "coreqs": requisiteInfo.filter(r => r.type == "co")
    };
    courseInfoDiv.html(courseInfoTemplate(courseInfoObject)).style("display", "block");
    d3.selectAll(".pre_line").filter(function(d) {
        return d3.select(this).attr("course") == course_num;
    }).attr("opacity", 1);

    // search for url, our program will only try it once 
    // once we get the url, it will be stored into the element as an attribute
    if (course.attr("request-send") == "false") {
        course.attr("request-send", true);
        checklinkvalidity(course);
    } else if (course.attr("syllabus-link") == "No syllabus") {
        courseInfoDiv.append("p").html("The instructor hasn't uploaded the syllabus yet!");
    } else if (course.attr("syllabus-link") != "") {
        courseInfoDiv.append("a")
            .attr("href", course.attr("syllabus-link"))
            .attr("target", "_blank")
            .html(course.attr("syllabus-link"));
    }
};

function hideCourseInfo(event, course) {
    d3.selectAll(".pre_line").filter(function(d) {
        return d3.select(this).attr("course") == course.attr("id");
    }).attr("opacity", requisite => requisite.requisite_is_primary == 1 ? 0.2 : 0);
};

// display the link to the syllabus only if it's valid
function checklinkvalidity(course) {
    const course_num = course.attr("id");
    var url;
    if (m < 9) {
        url = "http://www.math.ubc.ca/php/MathNet/courseinfo.php?session=" + (y - 1) + "W&t=outline&name=" + course_num + ":101";
    } else {
        url = "http://www.math.ubc.ca/php/MathNet/courseinfo.php?session=" + y + "W&t=outline&name=" + course_num + ":101";
    }
    getresponse(url).then(function() {
            courseInfoDiv.append("a")
                .attr("href", url)
                .attr("target", "_blank")
                .html(url);
            course.attr("syllabus-link", url);
        })
        .catch(function() {
            // courses only aviable in term 2 have a slightly different format...
            if (m < 9) {
                url = "http://www.math.ubc.ca/php/MathNet/courseinfo.php?session=" + (y - 1) + "W&t=outline&name=" + course_num + ":201";
            } else {
                url = "http://www.math.ubc.ca/php/MathNet/courseinfo.php?session=" + y + "W&t=outline&name=" + course_num + ":201";
            }
            getresponse(url).then(function() {
                courseInfoDiv.append("a")
                    .attr("href", url)
                    .attr("target", "_blank")
                    .html(url);
                course.attr("syllabus-link", url);
            }).catch(function() {
                courseInfoDiv.append("p").html("The instructor hasn't uploaded the syllabus yet!");
                course.attr("syllabus-link", "No syllabus");
            });
        })
}

function getresponse(url) {
    console.log("check url validity...")
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            type: "GET",
            complete: function(response) {
                if (response.responseText.includes("no outline exists")) {
                    reject();
                } else {
                    resolve();
                }
            }
        })
    })
}