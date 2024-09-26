import React, { useState, useRef, useEffect } from "react";

window.mobileAndTabletCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  };
  
export class SvgAreaStarterWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div
        draggable
        style={{ width: 30, height: 30 }}
        onDragStart={(e) => {
          e.dataTransfer.setData("text/plain", this.props.type);
        }}
      >
        {this.props.render(this.props)}
      </div>
    );
  }
}

export class SvgAreaWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      renderedAtLeastOnce: false,
    };
    this.isResizeAnchorSelected = false;
    this.childrenGroup = React.createRef();
  }
  componentWillUnmount() {
    this.setState({ renderedAtLeastOnce: false });
  }
  makeInsideArea(rect) {
    if (this.props.fixed) return;
    let [newX, newY, newWidth, newHeight] = [
      this.props.state.x,
      this.props.state.y,
      this.props.state.width,
      this.props.state.height,
    ];
    let changed = false;
    if (newX + newWidth > rect.width) {
      newX = rect.width - this.props.state.width;
      changed = true;
    } else if (newX < 0) {
      newX = 0;
      changed = true;
    }
    if (newY + newHeight > rect.height) {
      newY = rect.height - this.props.state.height;
      changed = true;
    } else if (newY < 0) {
      newY = 0;
      changed = true;
    }
    if (newWidth < 0) {
      newX += newWidth;
      newWidth *= -1;
      changed = true;
    }
    if (newHeight < 0) {
      newY += newHeight;
      newHeight *= -1;
      changed = true;
    }
    if (changed) {
      this.props.setState(this.props.key_, {
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
      });
    }
  }
  computePositionInsideArea(rect) {
    let [newX, newY, newWidth, newHeight] = [
      this.props.state.x,
      this.props.state.y,
      this.props.state.width,
      this.props.state.height,
    ];
    if (newX + newWidth > rect.width) {
      newX = rect.width - this.props.state.width;
    } else if (newX < 0) {
      newX = 0;
    }
    if (newY + newHeight > rect.height) {
      newY = rect.height - this.props.state.height;
    } else if (newY < 0) {
      newY = 0;
    }
    return { x: newX, y: newY };
  }
  componentDidMount() {
    this.mouseUpEventListener = () => {
      this.isResizeAnchorSelected = false;
      this.makeInsideArea(this.props.area);
    };
    window.addEventListener("mouseup", this.mouseUpEventListener);
    window.addEventListener("touchend", this.mouseUpEventListener);
    if (!this.state.renderedAtLeastOnce) {
      this.setState({ renderedAtLeastOnce: true });
      var config = { childList: true, subtree: true };
      this.childrenObserver = new MutationObserver((mutations) => {
        console.log(mutations);
        let box = this.childrenGroup.current.getBoundingClientRect();
        let newWidth = box.width;
        let newHeight = this.props.state.height;
        this.props.setState(this.props.key_, {
          width: newWidth,
          height: newHeight,
        });
      });
      this.childrenObserver.observe(this.childrenGroup.current, config);
    }
  }
  onDrag(prevMouseX, prevMouseY, mouseX, mouseY) {
    if (this.props.fixed) return;
    let [dx, dy] = [mouseX - prevMouseX, mouseY - prevMouseY];
    if (this.isResizeAnchorSelected) {
      let newWidth = this.props.state.width + dx;
      let newHeight = this.props.state.height + dy;
      let box = this.childrenGroup.current.getBoundingClientRect();
      let ratio = box.height / box.width;
      newHeight = ratio * newWidth;
      //     if (this.props.proportional) newHeight = ( newWidth = (newWidth + newHeight) / 2)
      let [minWidth, minHeight] = [box.width + 3, box.height + 3];
      if (newWidth < minWidth) newWidth = minWidth;
      if (newHeight < minHeight) newHeight = minHeight;
      this.props.setState(this.props.key_, {
        width: newWidth,
        height: newHeight,
      });
    } else {
      //    console.log("moving")
      this.props.setState(this.props.key_, {
        x: this.props.x + dx,
        y: this.props.state.y + dy,
      });
    }
  }
  
  static ResizeAnchorPointWidth = window.mobileAndTabletCheck() ? 40 : 10;
  static ResizeAnchorPointHeight =window.mobileAndTabletCheck() ? 40 : 10;
  static minWidgetWidth = 30;
  static minWidgetHeight = 30;
  static maxWidgetWidth = 100;
  static maxWidgetHeight = 100;
  render() {
    const childrenBox = this.childrenGroup.current
      ? this.childrenGroup.current.getBoundingClientRect()
      : {};
    const [childrendTX, childrendTY] = this.childrenGroup.current
      ? [
          (this.props.state.width - childrenBox.width) / 2,
          (this.props.state.height - childrenBox.height) / 2,
        ]
      : [0, 0];

    let previewPosition = { x: this.props.state.x, y: this.props.state.y };

    if (this.props.fixed) {
      previewPosition = this.computePositionInsideArea(this.props.area);
    }

    let borderProps =
      this.props.borderProps == undefined ? {} : this.props.borderProps;
    return (
      <g
        style={{
          cursor: this.props.fixed
            ? this.props.noClick
              ? "default"
              : "pointer"
            : "move",
        }}
        onMouseDown={(e) => {
          this.props.onMouseDown(this,e);
        }}
        onTouchStart={(e) => {
          this.props.onMouseDown(this,e);
        }}
        onMouseUp={(e) => {
          //    console.log('mouse up')
        }}
        transform={
          "translate(" +
          previewPosition.x +
          "," +
          previewPosition.y +
          ") rotate(0)"
        }
      >
        <rect
          {...{ fill: this.props.backgroundNoFill ? "#00000000" : "white" }}
          x={0}
          y={0}
          width={this.props.state.width}
          height={this.props.state.height}
          stroke="#000000"
          {...{ strokeWidth: "2" }}
          {...borderProps}
        />
        <g
          transform={"translate(" + childrendTX + "," + childrendTY + ")"}
          ref={this.childrenGroup}
        >
          {this.props.children}
        </g>
        <rect
          {...{
            fill: this.props.tintColor ? this.props.tintColor : "#00000000",
          }}
          x={0}
          y={0}
          width={this.props.state.width}
          height={this.props.state.height}
          stroke="#000000"
          {...{ strokeWidth: "2" }}
          {...borderProps}
        />
        {this.props.noClose ? undefined : (
          <g
            onClick={()=>this.props.deleteWidget(this.props.key_)}
            onTouchEnd={()=>this.props.deleteWidget(this.props.key_)}
            style={{ cursor: "pointer" }}
          >
            <circle
              cx={this.props.state.width}
              cy={0}
              r={window.mobileAndTabletCheck() ? 15 : 10}
              radius={window.mobileAndTabletCheck() ? 15 : 10}
              fill="#CC0000"
            />
            <text
              x={this.props.state.width}
              y={3}
              fill="white"
              style={{
                alignmentBaseline: "center",
                textAnchor: "middle",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none",
                userSelect: "none",
              }}
            >
              x
            </text>
          </g>
        )}
        {this.props.fixed ? undefined : (
          <rect
            style={{ cursor: "se-resize" }}
            onMouseDown={() => {
              this.isResizeAnchorSelected = true;
            }}
            onTouchStart={() => {
              this.isResizeAnchorSelected = true;
            }}
            fill="#000000"
            x={this.props.state.width - SvgAreaWidget.ResizeAnchorPointWidth}
            y={this.props.state.height - SvgAreaWidget.ResizeAnchorPointHeight}
            strokeWidth="2"
            width={SvgAreaWidget.ResizeAnchorPointWidth}
            height={SvgAreaWidget.ResizeAnchorPointHeight}
            strokeLinecap="null"
            strokeLinejoin="null"
            strokeDasharray="null"
            stroke="#000000"
          />
        )}
      </g>
    );
  }
}

/**
 * changes  :
 * added custom widgets rendering
 *
 *
 */

export class SvgArea extends React.Component {
  constructor(props) {
    super(props);
    this.selectedWidget = null;
    this.rootDiv = React.createRef();
    this.mouseX = 0;
    this.mouseY = 0;
    let fetchedValues = [];
    if (this.props.getInitialWidgets)
      fetchedValues = this.props.getInitialWidgets(props);
    this.state = {
      widgets: fetchedValues,
      width: 0,
      height: 0,
      dimensionsAdjusted: false,
    };
    this.firstRenderPerformed = false;
  }
  componentWillUnmount() {
    if (this.props.onUnmount)
      this.props.onUnmount(this.props, this.state.widgets);
  }
  deleteWidget(index) {
    let copy = [...this.state.widgets];
    copy.splice(index, 1);
    this.setState({ widgets: copy });
  }
  instanciateAt(x, y, type) {
    let widget = {
      x: x,
      y: y,
      width: 100,
      height: 100,
      type: type,
    };
    if (this.props.onAddWidget) widget = this.props.onAddWidget(widget);
    this.setState({ widgets: [...this.state.widgets, widget] });
  }
  onWidgetMouseDown(w,e) {
    this.updateMouseCoord(e)
    this.selectedWidget = w;
  }
  componentDidMount() {
    this.mouseUpEventListener = (e) => {
      if (this.selectedWidget) {
        this.selectedWidget = null;
        e.preventDefault();
      }
    };
    this.touchMoveEventListener = (e)=>{
        if (this.selectedWidget)
        {
            this.updateMouseCoord(e)
        }
    }
    window.addEventListener("mouseup", this.mouseUpEventListener);
    window.addEventListener("touchend", this.mouseUpEventListener)
    window.addEventListener("touchmove", this.touchMoveEventListener)
    window.addEventListener("mousedown", (e) => {
      //   e.preventDefault()
    });
    if (!this.firstRenderPerformed) {
      this.firstRenderPerformed = true;
      let childrenDiv = this.rootDiv.current.childNodes[0];
      var config = {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true,
      };
      this.adjustDimensions();

      this.childrenObserver = new MutationObserver((mutations) => {
        console.log("mutation 2");
        this.adjustDimensions();
      });
      this.childrenObserver.observe(childrenDiv, config);
    }
  }
  adjustDimensions() {
    //   alert("adjust")
    console.log("adjust");
    if (this.rootDiv.current == null) {
      setTimeout(() => {
        if (React.isValidElement(this)) {
          this.adjustDimensions();
        }
      }, 500);
    } else {
      this.firstRenderPerformed = true;
      let childrenBounderyRect = this.rootDiv.current.childNodes[0].getBoundingClientRect();
      this.setState({
        width: childrenBounderyRect.width,
        height: childrenBounderyRect.height,
        dimensionsAdjusted: true,
      });
    }
  }
  updateMouseCoord(e) {
    function offset(el) {
      var rect = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      return { y: rect.top + scrollTop, x: rect.left + scrollLeft };
    }
    let rect = offset(this.rootDiv.current);
    let xyAccess = e.touches ? e.touches[0] : e;
    this.mouseX = xyAccess.pageX - rect.x;
    this.mouseY = xyAccess.pageY - rect.y;
  }
  setWidgetState = (key, state) => {
    let copy = [...this.state.widgets];
    copy[key] = { ...copy[key], ...state };
    this.setState({ widgets: copy });
  };
  render() {
    if (this.props.ref_) {
      this.props.ref_(this);
    }
    return (
      <div
        ref={this.rootDiv}
        style={{
          width: this.state.width,
          height: this.state.height,
          position: "relative",
          zIndex: 100,
        }}
      >
        <div style={{ display: "inline-block" }}>{this.props.children}</div>
        {this.firstRenderPerformed ? (
          <div style={{ position: "absolute", top: 0, left: 0 }}>
            <svg
              width={this.state.width}
              height={this.state.height}
              onMouseMove={(e) => {
                e.preventDefault();
                let [prevMouseX, prevMouseY] = [this.mouseX, this.mouseY];
                this.updateMouseCoord(e);
                if (this.selectedWidget) {
                  this.selectedWidget.onDrag(
                    prevMouseX,
                    prevMouseY,
                    this.mouseX,
                    this.mouseY
                  );
                }
              }}
              style={{ touchAction: "none" }}
              onTouchMove={(e) => {
                //  e.preventDefault()
                let [prevMouseX, prevMouseY] = [this.mouseX, this.mouseY];
                console.log(
                  "touch move : " + JSON.stringify({ prevMouseX, prevMouseY })
                );
                this.updateMouseCoord(e);
                if (this.selectedWidget) {
                  this.selectedWidget.onDrag(
                    prevMouseX,
                    prevMouseY,
                    this.mouseX,
                    this.mouseY
                  );
                }
              }}
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDrop={(e) => {
                e.preventDefault();
                this.updateMouseCoord(e);
                let type = e.dataTransfer.getData("text");
                this.instanciateAt(this.mouseX, this.mouseY, type);
              }}
            >
              <g>
                <rect
                  id="svgBackgroundRect"
                  fill="#FFBBAA00"
                  strokeWidth="2"
                  width={this.state.width}
                  height={this.state.height}
                  y="0"
                  x="0"
                  strokeLinecap="null"
                  strokeLinejoin="null"
                  strokeDasharray="null"
                  stroke="#000000"
                />
                {this.state.widgets.map((w, key) => {
                  return (
                    <g key={key}>
                      {this.props.renderWidget(this.props.id, key, {
                        setState: this.setWidgetState,
                        state: this.state.widgets[key],
                        deleteWidget: this.deleteWidget.bind(this),
                        proportional: true,
                        key_: key,
                        childrendimension: 100,
                        width: w.width,
                        height: w.height,
                        x: w.x,
                        y: w.y,
                        area: {
                          width: this.state.width,
                          height: this.state.height,
                        },
                        onMouseDown: this.onWidgetMouseDown.bind(this),
                      })}
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>
        ) : undefined}
      </div>
    );
  }
}
