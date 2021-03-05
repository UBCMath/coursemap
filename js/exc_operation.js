function expand_exc(event, d, exclusions) {
    const exc_id = d.attr("id");
    const course_nums = exclusions
        .filter(function(c) {
            return c.exclusion_id == exc_id;
        })
        .map(a => a.course_number);
    const pre_state = d.attr("expanded");
    const x = d.select("circle").attr("cx");
    const y = d.select("circle").attr("cy");
    if (pre_state == "true") {
        d.attr("expanded", false);
    } else {
        d.attr("expanded", true);
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

function expand_lines(node, course_nums) {
    d3.selectAll(".pre_line")
        .each(function(d) {
            var line = d3.select(this);
            const exc_id = node.attr("id");
            const state = node.attr("expanded");
            const x = node.select("circle").attr("cx");
            const y = node.select("circle").attr("cy");
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