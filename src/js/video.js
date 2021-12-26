export class VideoPlayer {
  	constructor(_id) {
    	this.id = d3.select(_id);
    	this.picIndex = [5, 9, 1];
    	this.upcoming = null;


    	this.vidHolder = 
    		this.id.select("#video-holder")
    		.style("position", "relative")
    		.style("aspect-ratio", "1 / 1");

    	this.staticVidHolder = 
    		this.vidHolder.append("video")
    		.style("position", "absolute")
    		.style("left", 0)
    		.style("top", 0)
    		.attr("class", "lazy needChange")
    		.property("autoplay", true)
    		.property("muted", true)
    		.property("loop", true)
    		.property("playsinline", true)
    		.style("width", "100%")
    		.style("height", "100%")
    		.style("z-index", 1);
    	
    	this.staticVidSrc =
    		this.staticVidHolder
    		.append("source")
    		.attr("data-src", `assets/videos/static_morphing_0${this.picIndex[0]}_0${this.picIndex[1]}_${this.picIndex[2]}.mp4`)
    		.attr("type", "video/mp4");

    	this.reactionVidHolder = 
    		this.vidHolder.append("video")
    		.style("position", "absolute")
    		.style("left", 0)
    		.style("top", 0)
    		.property("autoplay", true)
    		.property("muted", true)
    		.property("playsinline", true)
    		.style("width", "100%")
    		.style("height", "100%");
    	
    	this.reactionVidSrc =
    		this.reactionVidHolder
    		.append("source")
    		.attr("src", "")
    		.attr("type", "video/mp4");

    	this.buttons = this.id.selectAll("button");

    	this.init();

	}

	showReaction(){
		this.reactionVidSrc
			.attr("src", `assets/videos/${this.upcoming}_morphing_0${this.picIndex[0]}_0${this.picIndex[1]}_${this.picIndex[2]}.mp4`)

		this.reactionVidHolder.node().load();

	}

	changeVid(a, b, c){
		this.picIndex = [a, b, c];

		this.staticVidHolder
			.attr("class", "lazy needChange");

		this.staticVidSrc
    		.attr("data-src", `assets/videos/static_morphing_0${this.picIndex[0]}_0${this.picIndex[1]}_${this.picIndex[2]}.mp4`);
	
    	this.staticVidHolder.node().load();
	}


	init(){

		this.buttons.on("click", (e) => {
			this.upcoming = e.target.dataset["item"];
			this.buttons.classed("btn-clicked", false);
			d3.select(e.target).classed("btn-clicked", true);
			this.showReaction();

		})

		this.reactionVidHolder.node()
			.addEventListener('canplay',() => this.staticVidHolder.style("opacity", 0),false);

		this.reactionVidHolder.node()
			.addEventListener('ended', () => {
				this.buttons.classed("btn-clicked", false);
				this.staticVidHolder.style("opacity", 100);
				this.reactionVidSrc.attr("src", "");
			}, false);

			const lazyVideo = d3.select("video.lazy").node();

			if ("IntersectionObserver" in window) {
			    var lazyVideoObserver = new IntersectionObserver(function(entries, observer) {
			      entries.forEach(function(video) {
			        if (video.isIntersecting) {
			          for (var source in video.target.children) {
			            var videoSource = video.target.children[source];
			            if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
			              videoSource.src = videoSource.dataset.src;
			            }
			          }

			          if (video.target.classList.contains("needChange")){
			          	video.target.load();
			          	video.target.classList.remove("needChange");
			          }
			        }
			      });
			    });

			    lazyVideoObserver.observe(lazyVideo);
			} 

	}


}
