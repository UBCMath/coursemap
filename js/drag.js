function clickcircle(event, d) {
    setiniposition(d);

    const course_num = d.attr("id");

    var c_status;
    d.select(".course")
        .each(function(d) {
            c_status = d3.select(this).classed("course_click");
            if (!c_status) {
                d3.select(this).classed("course_click", true);
                d3.select(this.parentNode).select("text").attr("fill", "white");
                d3.selectAll(".pre_line").filter(function(d) {
                    return d3.select(this).attr("course") == course_num;
                }).classed(".line_click", true);
            } else {
                d3.select(this).classed("course_click", false);
                d3.select(this.parentNode).select("text").attr("fill", "black");
                d3.selectAll(".pre_line").filter(function(d) {
                    return d3.select(this).attr("course") == course_num;
                }).each(function(d) {
                    d3.select(this).classed(".line_click", false);
                })
            }
        });
}

function setiniposition(d) {
    d.attr("ini_x", d.select(".course").attr("cx")); //set initial position for dragging
    d.attr("ini_y", d.select(".course").attr("cy"));
}

// drag courses
function dragcircle(event, d) {
    const course_num = d.attr("id");
    var x = event.x;
    var y = event.y;
    var cx_new = parseFloat(d.attr("ini_x")) + x;
    var cy_new = parseFloat(d.attr("ini_y")) + y;
    d.select(".course").attr("cx", cx_new);
    d.select(".course").attr("cy", cy_new);
    d.select("text").attr("x", cx_new);
    d.select("text").attr("y", cy_new);
    d.raise().attr("moved", true);
    updateLinesPos(course_num, cx_new, cy_new);
}

// following two methods are for reset button
// reset dragging
function resetdrag_1(d, exclusions) {
    d.append("rect")
        .attr("class", "reset_stroke")
        .attr("x", 122)
        .attr("y", 16);
    d.select("text").style("fill", "#808069");
    d3.selectAll(".node").each(function(d) {
        if (d3.select(this).attr("moved") == "true") {
            var cx_new = parseFloat(d3.select(this).attr("data-cx"));
            var cy_new = parseFloat(d3.select(this).attr("data-cy"));
            d3.select(this).select(".course").attr("cx", cx_new);
            d3.select(this).select(".course").attr("cy", cy_new);
            d3.select(this).select("text").attr("x", cx_new);
            d3.select(this).select("text").attr("y", cy_new);
            d3.select(this).raise().attr("moved", false);
        }
    });
    updateLinesPos();
    setTimeout(resetdrag_2, 200);
}

// animation ends after 200ms
function resetdrag_2() {
    d3.select(".reset_stroke").remove();
    d3.select(".reset_text").style("fill", "black");
}