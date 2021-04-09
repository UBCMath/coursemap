var excInfoTemplate = _.template("<h2><%= title %></h2><br><br> <%= description %>");

// the third parameter is to order and display expanded grouping buttons on the right
function expand_exc(d, exclusions, exc_expanded) {
    const exc_id = d.attr("id");
    const course_nums = exclusions
        .filter(function(c) {
            return c.exclusion_id == exc_id;
        })
        .map(a => a.course_number);
    const pre_state = d.attr("expanded");
    if (pre_state == "true") {
        d.attr("expanded", false);
        d.style("transform", null);
        exc_expanded.splice(exc_expanded.indexOf(exc_id), 1, 0);
    } else {
        d.attr("expanded", true);
        var index = exc_expanded.indexOf(0);
        move_circle(d, index);
        exc_expanded[index] = exc_id;
    }

    course_nums.forEach((num, i) => {
        d3.selectAll(".node")
            .filter(function(d) {
                return d3.select(this).attr("id") == num;
            })
            .each(function(d) {
                if (pre_state == "false") {
                    d3.select(this).attr("display", "blocked");
                } else {
                    d3.select(this).attr("display", "none");
                }
            });
    });

    expand_lines(d, course_nums);
    updateLinesPos();
}

// display grouping buttons in order
function move_circle(d, index) {
    const x = d.select("circle").attr("cx");
    const y = d.select("circle").attr("cy");
    d.style("transform", "translateX(" + (-x + width - 200 + (index % 4) * 50).toString() +
        "px) translateY(" + (-y + 185 + 30 * parseInt(index / 4)).toString() + "px)");
}

// update the endpoints of lines so it will not conflict with dragging
function expand_lines(node, course_nums) {
    d3.selectAll(".pre_line")
        .each(function(d) {
            var line = d3.select(this);
            const exc_id = node.attr("id");
            const state = node.attr("expanded");
            const str = line.attr("id"); // always in "course-course" form
            const course = str.split("-")[0]; // store true course
            const pre = str.split("-")[1]; // store true pre
            // set course/pre to exclutions id (1 to 18) if necessary 
            if (course_nums.includes(course) && state == "false") {
                line.attr("course", exc_id);
            } else if (course_nums.includes(course) && state == "true") {
                line.attr("course", str.split("-")[0]);
            } else if (course_nums.includes(pre) && state == "false") {
                line.attr("pre", exc_id);
            } else if (course_nums.includes(pre) && state == "true") {
                line.attr("pre", str.split("-")[1]);
            }
        });
}

function showexcinfo(event, d, excinfos) {
    const exc_id = d.attr("id");
    const excinfo = excinfos.find(function(c) {
        return c.id == exc_id;
    });
    courseInfo_cur = exc_id;
    courseInfoDiv.html(excInfoTemplate(excinfo)).style("display", "block");
}