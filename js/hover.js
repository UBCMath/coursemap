var d = new Date();
var y = d.getFullYear();
var m = d.getMonth() + 1;
var courseInfoTemplate = _.template(
    "<strong>MATH <%= number %> <%= title %> </strong></br></br> <%= description %></br></br>"
);

function showinfo(event, d, coursesinfo, reqinfo) {
    const course_num = d.attr("id");
    var tooltip;
    if (event.type == "mouseover") {
        if (d3.select("#coursemap").selectAll(".tooltip").filter(function(d) {
                return this.id == "click" + course_num;
            })
            .size() != 0) {
            return;
        } // if the tooltips has already been made, do nothing
        tooltip = d3
            .select("#coursemap")
            .append("div")
            .attr("class", "tooltip")
            .attr("id", course_num);
    } else {
        tooltip = d3.select("#coursemap").selectAll(".tooltip").filter(function(d) {
            return this.id == course_num;
        });
        if (tooltip.size() != 0) {
            tooltip.attr("id", "click" + course_num);
            checklinkvalidity(course_num, tooltip);
            return;
        }
        tooltip = d3
            .select("#coursemap")
            .append("div")
            .attr("class", "tooltip")
            .attr("id", "click" + course_num);
    }
    d.select(".course").classed("course-hover", true);

    const courseinfo = coursesinfo.find(function(c) {
        return c.number == course_num;
    });
    const bar_x = event.pageX;
    const bar_y = event.pageY;
    tooltip
        .style("left", bar_x + 5 + "px")
        .style("top", bar_y + 5 + "px")
        .append("p")
        .html(courseInfoTemplate(courseinfo));

    var table = tooltip.append("table").attr("border", 1);

    for (var key in reqinfo) {
        if (course_num == reqinfo[key].course_number) {
            var tr = table.append("tr");
            tr.append("th")
                .style("font", "14px sans-serif")
                .html(reqinfo[key].type);
            tr.append("th")
                .style("font", "14px sans-serif")
                .html(reqinfo[key].description);
        }
    }

    // To save computations, the link to the syllabus won't appear if one just hangs the mouse over a course
    // (in this case, the student also won't have chance to click the link, as the tooltip will soonly disappear)
    if (event.type == "click") {
        checklinkvalidity(course_num, tooltip);
    }

    // adjust position thus tooltip won't overflow from the screen while near the edge
    tooltip.style("transform", function(d) {
        var str = "";
        if (bar_x + 400 >= width) {
            str = "translateX(" + (width - 400 - bar_x).toString() + "px) ";
        }
        const barlength = 200; // weird bug will happen when trying to get height of tooltip, use preset constant instead
        if (bar_y + barlength >= height) {
            str =
                str + "translateY(" + (height - barlength - bar_y).toString() + "px)";
        }
        return str;
    });

    d3.select("#coursemap")
        .select("svg")
        .selectAll(".pre_line")
        .filter(function(d) {
            const str = this.id;
            const course = str.split("-")[0];
            return course == course_num;
        })
        .classed("pre_line-hover", true);
}

function hideinfo(event, d) {
    const course_num = d.attr("id");
    var tooltip;
    if (event.type == "mouseout") {
        tooltip = d3.select("#coursemap").selectAll(".tooltip").filter(function(d) {
            return this.id == course_num;
        });
    } else {
        tooltip = d3.select("#coursemap").selectAll(".tooltip").filter(function(d) {
            return this.id == "click" + course_num;
        });
    }
    tooltip.remove();

    d3.selectAll(".course")
        .filter(function(d) {
            return this.id == course_num;
        })
        .classed("course-hover", false);

    d3.select("#coursemap")
        .select("svg")
        .selectAll(".pre_line")
        .filter(function(d) {
            var str = d3.select(this).attr("id");
            const course = str.split("-")[0];
            return course == course_num;
        })
        .classed("pre_line-hover", false);
}

// display the link to the syllabus only if it's valid
function checklinkvalidity(course_num, tooltip) {
    var url;
    if (m < 9) {
        url = "http://www.math.ubc.ca/php/MathNet/courseinfo.php?session=" + (y - 1) + "W&t=outline&name=" + course_num + ":101";
    } else {
        url = "http://www.math.ubc.ca/php/MathNet/courseinfo.php?session=" + y + "W&t=outline&name=" + course_num + ":101";
    }
    getresponse(url).then(function() {
            tooltip.append("p").html("Syllabus: </br>")
                .append("a")
                .attr("href", url)
                .attr("target", "_blank")
                .html(url);
        })
        .catch(function() {
            // courses only aviable in term 2 have a slightly different format...
            if (m < 9) {
                url = "http://www.math.ubc.ca/php/MathNet/courseinfo.php?session=" + (y - 1) + "W&t=outline&name=" + course_num + ":201";
            } else {
                url = "http://www.math.ubc.ca/php/MathNet/courseinfo.php?session=" + y + "W&t=outline&name=" + course_num + ":201";
            }
            getresponse(url).then(function() {
                tooltip.append("p").html("Syllabus: </br>")
                    .append("a")
                    .attr("href", url)
                    .attr("target", "_blank")
                    .html(url);
            }).catch(function() {
                console.log("The instructor hasn't uploaded the syllabus yet!")
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