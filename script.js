Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4Y2UxNzZkMy0zNzQ0LTRlNDgtOWNiMS0yMTMyMzRkMDNkM2EiLCJpZCI6MjI3MDAwLCJpYXQiOjE3MjA0MTczNDl9.sgA8iXyS8xJ8GKaarEABWdW7wuHhL6Jp4Yvo0UUqiNc";
const viewer = new Cesium.Viewer("cesiumContainer", {
  terrainProvider: Cesium.createWorldTerrain(),
  skyAtmosphere: false,
  sceneModePicker: false,
  timeline: true,
  animation: false,
  creditContainer: document.createElement("div"),
  shadows: true,
  requestRenderMode: true,
});
viewer.scene.globe.enableLighting = true;
viewer.scene.backgroundColor = Cesium.Color.BLACK;
viewer.scene.skyBox.show = true;
let siteIndex = 0,
  prevSiteIndex = -1;
let descriptionIndex = 0;
const allSites = await (await fetch("./sites.json")).json();
console.log("result", allSites);
let sites = [];
const updateList = (tag) => {
  console.log("tag", tag);
  sites = allSites.filter(
    (site, index) =>
      index === 0 ||
      index === allSites.length - 1 ||
      !tag ||
      site.tags.includes(tag),
  );
  console.log(sites);
  viewer.entities.removeAll();
  sites
    .slice(1, -1)
    .filter((site) => site.showPoint === undefined || site.showPoint === true)
    .forEach((site, index) => {
      const entity = viewer.entities.add({
        name: site.site_name,
        position: Cesium.Cartesian3.fromDegrees(
          site.longitude,
          site.latitude,
          site.altitude,
        ),
        point: {
          pixelSize: 10,
          color: Cesium.Color.RED,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        },
        label: {
          text: site.site_name,
          font: "14pt monospace",
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 2,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -20),
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        },
      });
    });
  siteIndex = 0;
  prevSiteIndex = -1;
  descriptionIndex = 0;
  viewer.scene.render();
  updateInfoPanel();
};
document.querySelector("#subkind").addEventListener("change", (e) => {
  updateList(e.target.value);
});
updateList(null);

function updateInfoPanel() {
  // if (index < 0 || index >= sites.length) {
  //     console.error('Invalid index for updateInfoPanel:', index);
  //     return;
  // }
  const site = sites[siteIndex];
  document.getElementById("siteDescription").innerHTML = `
                <h2>${site.site_name}</h2>
                <p>${site.descriptions[descriptionIndex] || ""}</p>
                <!-- <p><strong>Celestial Body:</strong> ${site.celestial_body}</p> -->
                <!-- <p><strong>Tags:</strong> ${site.tags.join(", ")}</p> -->
                <img src="${site.image_url}" alt="" width="200" />
                <p>${site.image_desc || ""}</p>
            `;
  if (prevSiteIndex !== siteIndex)
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        site.longitude,
        site.latitude - 0.02,
        site.altitude || 10_000_000,
      ),
      orientation: {
        heading: Cesium.Math.toRadians(site.heading || 0),
        pitch: Cesium.Math.toRadians(site.pitch || -90),
      },
    });
  prevSiteIndex = siteIndex;
}
document.getElementById("prevSlide").addEventListener("click", function () {
  // currentIndex = (currentIndex - 1 + sites.length) % sites.length;
  if (descriptionIndex <= 0) {
    if (siteIndex === 0) return;
    siteIndex--;
    descriptionIndex = sites[siteIndex].descriptions.length;
  }
  descriptionIndex--;
  updateInfoPanel();
});
document.getElementById("nextSlide").addEventListener("click", function () {
  descriptionIndex++;
  if (descriptionIndex >= sites[siteIndex].descriptions.length) {
    if (siteIndex === sites.length - 1) return;
    siteIndex++;
    descriptionIndex = 0;
  }
  updateInfoPanel();
});
viewer.selectedEntityChanged.addEventListener(function (entity) {
  if (entity) {
    const index = sites.findIndex((site) => site.site_name === entity.name);
    siteIndex = index;
    descriptionIndex = 0;
    updateInfoPanel();
  }
});
updateInfoPanel();

viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(0, 0, 40000000), // Adjust altitude to display the whole Earth
  orientation: {
    heading: Cesium.Math.toRadians(0.0),
    pitch: Cesium.Math.toRadians(-90.0), // Straight down
    roll: 0.0,
  },
});

// Cesium.createOsmBuildingsAsync().then(buildingTileset => {
//     viewer.scene.primitives.add(buildingTileset);
// }).catch(error => {
//     console.error('Error loading OSM buildings:', error);
// });
