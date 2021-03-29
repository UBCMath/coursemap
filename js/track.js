// click drop menu to list interests
function clickdropdown() {
    d3.selectAll(".track_panel").each(function(d) {
        if (d3.select(this).attr("visibility") == "hidden") {
            d3.select(this).attr("visibility", "visible");
        } else {
            d3.select(this).attr("visibility", "hidden");
        }
    });
}

// track interest while clicking a dropdown button
function selecttrack(d, tracksinfo) {
    const track_id = d.attr("id");
    var t_status;
    d3.selectAll(".track_button").each(function(d) {
        if (this.id == track_id) {
            t_status = d3.select(this).classed("track_button-tracking");
            d3.select(this).classed("track_button-tracking", !t_status);
        } else {
            d3.select(this).classed("track_button-tracking", false);
        }
    });
    if (d.attr("visibility") == "visible") {
        var tracked_courses = tracksinfo.filter((tc) => tc.track_id == track_id);
        d3.select("#coursemap").select("svg").selectAll(".course").each(function(d) {
            const c_id = this.id;
            for (var key in tracked_courses) {
                if (c_id == tracked_courses[key].course_number) {
                    d3.select(this).classed("course-program", !t_status);
                    return;
                }
            }
            if (d3.select(this).classed("course-program")) {
                d3.select(this).classed("course-program", false);
            }
        });
        d3.select("#coursemap").select("svg").selectAll(".pre_line").each(function(d) {
            const str = this.id;
            const course = str.split("-")[0];
            for (var key in tracked_courses) {
                if (course == tracked_courses[key].course_number) {
                    d3.select(this).classed("pre_line-program", !t_status);
                    return;
                }
            }
            if (d3.select(this).classed("pre_line-program")) {
                d3.select(this).classed("pre_line-program", false);
            }
        });
    }
}