// drag courses
function dragcircle(event, d) {
    const course_num = d.attr("id");
    var x = event.x;
    var y = event.y;
    var cx_new = parseFloat(d.attr("data-cx")) + x;
    var cy_new = parseFloat(d.attr("data-cy")) + y;
    d.select(".course").attr("cx", cx_new);
    d.select(".course").attr("cy", cy_new);
    d.select(".course_num").attr("x", cx_new);
    d.select(".course_num").attr("y", cy_new + 2.5);
    d.raise().attr("moved", true);
    updateLinesPos(course_num, cx_new, cy_new);

}

// following two methods are for reset button
// reset dragging
function resetdrag_1(d, exclusions) {
    d.append("rect")
        .attr("class", "reset_stroke")
        .attr("x", 160)
        .attr("y", 18);
    d.select("text").style("fill", "#BC1B3C");
    d3.selectAll(".node").each(function(d) {
        if (d3.select(this).attr("moved") == "true") {
            var cx_new = parseFloat(d3.select(this).attr("data-cx"));
            var cy_new = parseFloat(d3.select(this).attr("data-cy"));
            d3.select(this).select(".course").attr("cx", cx_new);
            d3.select(this).select(".course").attr("cy", cy_new);
            d3.select(this).select(".course_num").attr("x", cx_new);
            d3.select(this).select(".course_num").attr("y", cy_new + 2.5);
            d3.select(this).raise().attr("moved", false);
        }
    });
    d3.selectAll(".exc").each(function(d) {
        const exc_id = d3.select(this).attr("id");
        var course_nums = exclusions.filter(function(c) {
            return c.exclusion_id == exc_id;
        }).map((a) => a.course_number);
        expand_lines(d3.select(this), course_nums);
    });
    updateLinesPos();
    setTimeout(resetdrag_2, 200);
}

// animation ends after 200ms
function resetdrag_2() {
    d3.select(".reset_stroke").remove();
    d3.select(".reset_text").style("fill", "black");
}