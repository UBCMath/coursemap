// drag courses
function dragcircle(event, d) {
    const course_num = d.attr("id");
    var x = event.x;
    var y = event.y;
    d.raise()
        .attr("transform", (d) => "translate(" + [x, y] + ")");
    d.raise().attr("moved", true);
    d3.select("#coursemap").select("svg").selectAll(".pre_line").each(function() {
        const str = this.id;
        const course = str.split("-")[0];
        const pre = str.split("-")[1];
        if (course == course_num) {
            var x1_new = parseFloat(d3.select(this).attr("data-x1")) + x;
            var y1_new = parseFloat(d3.select(this).attr("data-y1")) + y;
            d3.select(this).attr("x1", x1_new);
            d3.select(this).attr("y1", y1_new);
        } else if (pre == course_num) {
            var x2_new = parseFloat(d3.select(this).attr("data-x2")) + x;
            var y2_new = parseFloat(d3.select(this).attr("data-y2")) + y;
            d3.select(this).attr("x2", x2_new);
            d3.select(this).attr("y2", y2_new);
        }
    });
}

// following two methods are for reset button
// reset dragging
function resetdrag_1(d) {
    d.append("rect")
        .attr("class", "reset_stroke")
        .attr("x", 114)
        .attr("y", 16);
    d.select("text").style("fill", "#BC1B3C");
    d3.selectAll(".node").each(function(d) {
        if (d3.select(this).attr("moved") == "true") {
            d3.select(this)
                .raise()
                .attr("transform", "");
            d3.select(this).raise().attr("moved", false);
            const course_num = d3.select(this).attr("id");
            d3.select("#coursemap").select("svg").selectAll(".pre_line").each(function() {
                const str = this.id;
                const course = str.split("-")[0];
                const pre = str.split("-")[1];
                if (course == course_num) {
                    var x1_new = parseFloat(d3.select(this).attr("data-x1"));
                    var y1_new = parseFloat(d3.select(this).attr("data-y1"));
                    d3.select(this).attr("x1", x1_new);
                    d3.select(this).attr("y1", y1_new);
                } else if (pre == course_num) {
                    var x2_new = parseFloat(d3.select(this).attr("data-x2"));
                    var y2_new = parseFloat(d3.select(this).attr("data-y2"));
                    d3.select(this).attr("x2", x2_new);
                    d3.select(this).attr("y2", y2_new);
                }
            });
        }
    })
    setTimeout(resetdrag_2, 200);
}

// animation ends after 200ms
function resetdrag_2() {
    d3.select(".reset_stroke").remove();
    d3.select(".reset_text").style("fill", "black");
}