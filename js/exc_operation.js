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

function move_circle(d, index) {
    const x = d.select("circle").attr("cx");
    const y = d.select("circle").attr("cy");
    d.style("transform", "translateX(" + (-x + width - 200 + (index % 4) * 50).toString() +
        "px) translateY(" + (-y + 190 + 30 * parseInt(index / 4)).toString() + "px)");
}

function expand_lines(node, course_nums) {
    d3.selectAll(".pre_line")
        .each(function(d) {
            var line = d3.select(this);
            const exc_id = node.attr("id");
            const state = node.attr("expanded");
            const str = line.attr("id"); // always in course-course form
            const course = str.split("-")[0]; // true course
            const pre = str.split("-")[1]; // true pre
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
    var tooltip = d3.select("#coursemap").select(".tooltip");

    const excinfo = excinfos.find(function(c) {
        return c.id == exc_id;
    });
    const bar_x = event.pageX;
    const bar_y = event.pageY;
    tooltip.style("left", bar_x + 5 + "px")
        .style("top", bar_y + 5 + "px")
        .style("display", "block")
        .html(excinfo.description);

    // adjust position thus tooltip won't overflow from the screen while near the edge
    tooltip.style("transform", function(d) {
        var str = "";
        if (bar_x + 400 >= width) {
            str = "translateX(" + (width - 400 - bar_x).toString() + "px) ";

        }
        const barlength = 200; // weird bug will happen when trying to get height of tooltip, use preset constant instead
        if (bar_y + barlength >= height) {
            str = str + "translateY(" + (height - barlength - bar_y).toString() + "px)";
        }
        return str;
    });
}

function hideexcinfo(d) {
    var tooltip = d3.select("#coursemap").select(".tooltip");
    tooltip.style("display", "none");
}