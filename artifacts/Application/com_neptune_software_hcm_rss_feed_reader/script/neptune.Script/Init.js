let carouselFeedInterval;

sap.ui.getCore().attachInit(function (startParams) {

    carouselFeed.attachBrowserEvent("mouseenter", function (e) {
        clearInterval(carouselFeedInterval);
    });
    carouselFeed.attachBrowserEvent("mouseleave", function (e) {
        carouselFeedInterval = setInterval(function () {
            carouselFeed.next();
        }, 6000);
    });

    carouselFeedInterval = setInterval(function () {
        carouselFeed.next();
    }, 6000);

    $.ajax({
        url: "https://api.rss2json.com/v1/api.json",
        method: "GET",
        dataType: "json",
        data: {
            // rss_url: "https://www.nasa.gov/rss/dyn/solar_system.rss"
            rss_url: "https://lifehacker.com/rss"
        },
        success: function (data) {

            data.items.forEach(item => {

                let addThumb = false;

                const page = new sap.m.Page("__nep" + ModelData.genID(),{
                    showHeader: false,
                    enableScrolling: false
                });
                carouselFeed.addPage(page);

                let layoutSlideContainer = new sap.m.FlexBox("__nep" + ModelData.genID(), {
                    renderType: "Bare",
                    width: "100%",
                    justifyContent: "SpaceBetween",
                }).addStyleClass("nepHCMFeedItem");

                layoutSlideContainer.attachBrowserEvent("click", function (e) {
                    window.open(item.link, "_blank");
                });

                page.addContent(layoutSlideContainer);

                let layoutSlideTextContent = new sap.m.VBox("__nep" + ModelData.genID(), {
                    renderType: "Bare",
                    justifyContent: "SpaceBetween",
                }).addStyleClass("nepHCMFeedContent");

                let layoutSlideImageContent = new sap.m.VBox("__nep" + ModelData.genID(), {
                    renderType: "Bare",
                }).addStyleClass("nepHCMFeedImage");

                layoutSlideContainer.addItem(layoutSlideTextContent);

                let layoutSlideTextLayout = new sap.m.VBox("__nep" + ModelData.genID(), {
                    renderType: "Bare",
                });
                layoutSlideTextContent.addItem(layoutSlideTextLayout);

                if (!!item.title) {
                    let txtSlideTitle = new sap.m.Text("__nep" + ModelData.genID(), {
                        text: item.title,
                    }).addStyleClass("nepHCMFeedTitle");
                    layoutSlideTextLayout.addItem(txtSlideTitle);
                }

                if (!!item.description) {
                    let txtSlideDescription = new sap.m.FormattedText("__nep" + ModelData.genID(), {
                        htmlText: item.description,
                    }).addStyleClass("nepHCMFeedText");
                    layoutSlideTextLayout.addItem(txtSlideDescription);
                }
                let imgSlideThumbnail;

                if (!!item.thumbnail) {
                    imgSlideThumbnail = new sap.m.Image("__nep" + ModelData.genID(), {
                        src: item.thumbnail,
                    });
                } else if (item?.enclosure?.type?.indexOf("image") > -1) {
                    imgSlideThumbnail = new sap.m.Image("__nep" + ModelData.genID(), {
                        src: item.enclosure.link,
                    });
                }
                if (!!imgSlideThumbnail) {
                    layoutSlideImageContent.addItem(imgSlideThumbnail);
                    addThumb = true;
                }

                if (!!item.pubDate) {
                    let layoutFooter = new sap.m.HBox("__nep" + ModelData.genID(), {
                        renderType: "Bare",
                    }).addStyleClass("nepTileFooter");
                    layoutSlideTextContent.addItem(layoutFooter);

                    let footer = new sap.m.Text("__nep" + ModelData.genID(), {
                        text: item.pubDate,
                    });
                    layoutFooter.addItem(footer);
                }
                if (addThumb) {
                    layoutSlideContainer.addItem(imgSlideThumbnail);
                }
            });
        },
        error: function (xhr, status, error) {
            console.error("Error...");
        },
    });
});
