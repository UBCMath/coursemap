// click a course to mark it
function clickcircle(event, d) {
    d.attr("ini_x", d.select(".course").attr("cx")); //set initial position for dragging
    d.attr("ini_y", d.select(".course").attr("cy"));

    if (event.type == "click") { // drag nodes should not change node's status
        switch (parseInt(d.attr("status"))) {
            case 0:
                d.attr("status", 1);
                break;
            case 1:
                d.attr("status", 2);
                return;
            case 2:
                d.attr("status", 0);
                break;
        }
    }

    const course_num = d.attr("id");

    var c_status;
    d.select(".course")
        .each(function(d) {
            c_status = d3.select(this).classed("course-click");
            d3.select(this).classed("course-click", !c_status);
        });

    d3.select("#coursemap").select("svg").selectAll(".pre_line").each(function(d) {
        const str = this.id;
        const course = str.split("-")[0];
        const pre = str.split("-")[1];
        if (course == course_num) {
            d3.select(this).classed("pre_line-click", !c_status);
        }
    });
}