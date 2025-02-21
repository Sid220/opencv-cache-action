import * as crypto from "crypto";

export class Configurations {
    public branch: string;
    public BUILD_LIST: string;
    public NO_CONTRIB: string;
    public DO_SHRINK: string;

    constructor(branch: string,
      NO_CONTRIB: string,
      DO_SHRINK: string,
      BUILD_opencv_python3: string,
      WITH_GSTREAMER: string
    ) {
        this.branch = branch || "4.6.0";
        //this.BUILD_LIST = BUILD_LIST || "core,imgproc,imgcodecs,videoio,highgui,video,calib3d,features2d,objdetect,dnn,ml,photo,gapi,python3,python_bindings_generator";
        this.NO_CONTRIB = NO_CONTRIB || "";
        this.DO_SHRINK = DO_SHRINK || "";
        this.BUILD_opencv_python3 = BUILD_opencv_python3 || "ON";
        this.WITH_GSTREAMER = WITH_GSTREAMER || "ON";
        this.normalize();
    }
    normalize() {
      this.BUILD_LIST = this.BUILD_LIST
      .split(",")
      .filter((a) =>a.trim() )
      .sort()
      .join(",");
    }

    get sig(): string {
        const hash = crypto.createHash("md5");
        hash.update(this.BUILD_LIST);
        return hash.digest("hex");
    }

    get storeKey(): string{
        const platform = process.env.RUNNER_OS;
        const ct = this.NO_CONTRIB ? "-no-contrib" : ""
        const shr = this.DO_SHRINK ? "-lt" : ""
        return `opencv-${platform}-${this.branch}-${this.sig}${ct}${shr}`;
    }

    get openCVUrl(): string {
        return `https://github.com/opencv/opencv/archive/${this.branch}.zip`;
    }

    get openCVContribUrl(): string {
        return `https://github.com/opencv/opencv_contrib/archive/${this.branch}.zip`;
    }

    get cacheDir(): string[] {
        if (this.NO_CONTRIB)
            return ["opencv", "build"];
        return ["opencv", "opencv_contrib", "build"];
    }
}
  
  
