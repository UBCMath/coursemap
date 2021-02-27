// click a course to mark it
function clickcircle(d) {
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