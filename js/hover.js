var courseInfoTemplate = _.template("<strong>MATH <%= number %> <%= title %></strong><br><br> <%= description %><br><br>");

function showinfo(event, d, coursesinfo, reqinfo) {
    const course_num = d.attr("id");
    var tooltip = d3.select("#coursemap").select(".tooltip");
    d.select(".course").classed("course-hover", true);

    const courseinfo = coursesinfo.find(function(c) {
        return c.number == course_num;
    });

    const bar_x = event.pageX;
    const bar_y = event.pageY;
    tooltip.style("left", bar_x + 5 + "px")
        .style("top", bar_y + 5 + "px")
        .style("display", "block")
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


    d3.select("#coursemap").select("svg")
        .selectAll(".pre_line")
        .filter(function(d) {
            const str = this.id;
            const course = str.split("-")[0];
            const pre = str.split("-")[1];
            return course == course_num;
        })
        .classed("pre_line-hover", true);
}

function hideinfo(d) {
    const course_num = d.attr("id");
    var tooltip = d3.select("#coursemap").select(".tooltip");

    d3.selectAll(".course")
        .filter(function(d) {
            return this.id == course_num;
        })
        .classed("course-hover", false);

    d3.select("#coursemap").select("svg")
        .selectAll(".pre_line")
        .filter(function(d) {
            var str = d3.select(this).attr("id");
            const course = str.split("-")[0];
            const pre = str.split("-")[1];
            return course == course_num;
        })
        .classed("pre_line-hover", false);

    tooltip.style("display", "none");
}