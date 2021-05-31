var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { mean } from "d3-array";

import { path as d3Path } from 'd3-path';
import { interpolateNumber } from 'd3-interpolate';

import { last, noop } from './utils';

var ZoomButtons = function (_Component) {
  _inherits(ZoomButtons, _Component);

  function ZoomButtons(props) {
    _classCallCheck(this, ZoomButtons);

    var _this = _possibleConstructorReturn(this, (ZoomButtons.__proto__ || Object.getPrototypeOf(ZoomButtons)).call(this, props));

    _this.handleZoomOut = _this.handleZoomOut.bind(_this);
    _this.handleZoomIn = _this.handleZoomIn.bind(_this);
    _this.zoom = _this.zoom.bind(_this);
    return _this;
  }

  _createClass(ZoomButtons, [{
    key: 'zoom',
    value: function zoom(direction) {
      var _this2 = this;

      var _context = this.context,
          xAxisZoom = _context.xAxisZoom,
          xScale = _context.xScale,
          plotData = _context.plotData,
          xAccessor = _context.xAccessor;

      var cx = xScale(xAccessor(last(plotData)));
      // mean(xScale.range());
      var zoomMultiplier = this.props.zoomMultiplier;


      var c = direction > 0 ? 1 * zoomMultiplier : 1 / zoomMultiplier;

      var _xScale$domain = xScale.domain(),
          _xScale$domain2 = _slicedToArray(_xScale$domain, 2),
          start = _xScale$domain2[0],
          end = _xScale$domain2[1];

      var _xScale$range$map$map = xScale.range().map(function (x) {
        return cx + (x - cx) * c;
      }).map(xScale.invert),
          _xScale$range$map$map2 = _slicedToArray(_xScale$range$map$map, 2),
          newStart = _xScale$range$map$map2[0],
          newEnd = _xScale$range$map$map2[1];

      var left = interpolateNumber(start, newStart);
      var right = interpolateNumber(end, newEnd);

      var foo = [0.25, 0.3, 0.5, 0.6, 0.75, 1].map(function (i) {
        return [left(i), right(i)];
      });

      this.interval = setInterval(function () {
        xAxisZoom(foo.shift());
        if (foo.length === 0) {
          clearInterval(_this2.interval);
          delete _this2.interval;
        }
      }, 10);
    }
  }, {
    key: 'handleZoomOut',
    value: function handleZoomOut() {
      if (this.interval) return;
      this.zoom(1);
    }
  }, {
    key: 'handleZoomIn',
    value: function handleZoomIn() {
      if (this.interval) return;
      this.zoom(-1);
    }
  }, {
    key: 'render',
    value: function render() {
      var chartConfig = this.context.chartConfig;
      var width = chartConfig.width,
          height = chartConfig.height;
      var _props = this.props,
          size = _props.size,
          heightFromBase = _props.heightFromBase,
          rx = _props.rx,
          ry = _props.ry;
      var _props2 = this.props,
          stroke = _props2.stroke,
          strokeOpacity = _props2.strokeOpacity,
          fill = _props2.fill,
          strokeWidth = _props2.strokeWidth,
          fillOpacity = _props2.fillOpacity;
      var _props3 = this.props,
          textFill = _props3.textFill,
          textStrokeWidth = _props3.textStrokeWidth;
      var onReset = this.props.onReset;

      var centerX = Math.round(width / 2);
      var y = height - heightFromBase;

      var _size = _slicedToArray(size, 2),
          w = _size[0],
          h = _size[1];

      var hLength = 5;
      var wLength = 6;

      var textY = Math.round(y + h / 2);

      var resetX = centerX;

      var zoomOut = d3Path();
      var zoomOutX = centerX - w - 2 * strokeWidth;
      zoomOut.moveTo(zoomOutX - wLength, textY);
      zoomOut.lineTo(zoomOutX + wLength, textY);
      zoomOut.closePath();

      var zoomIn = d3Path();
      var zoomInX = centerX + w + 2 * strokeWidth;

      zoomIn.moveTo(zoomInX - wLength, textY);
      zoomIn.lineTo(zoomInX + wLength, textY);

      zoomIn.moveTo(zoomInX, textY - hLength);
      zoomIn.lineTo(zoomInX, textY + hLength);
      // zoomIn.closePath();

      return React.createElement(
        'g',
        { className: 'react-stockcharts-zoom-button' },
        React.createElement('rect', {
          x: zoomOutX - w / 2,
          y: y,
          rx: rx,
          ry: ry,
          height: h,
          width: w,
          fill: fill,
          fillOpacity: fillOpacity,
          stroke: stroke,
          strokeOpacity: strokeOpacity,
          strokeWidth: strokeWidth
        }),
        React.createElement('path', {
          d: zoomOut.toString(),
          stroke: textFill,
          strokeWidth: textStrokeWidth
        }),
        React.createElement('rect', {
          x: resetX - w / 2,
          y: y,
          rx: rx,
          ry: ry,
          height: h,
          width: w,
          fill: fill,
          fillOpacity: fillOpacity,
          stroke: stroke,
          strokeOpacity: strokeOpacity,
          strokeWidth: strokeWidth
        }),
        React.createElement(
          'g',
          { transform: 'translate (' + resetX + ', ' + (y + h / 4) + ') scale(.14)' },
          React.createElement('path', {
            d: 'M31 13C23.4 5.3 12.8.5 1.1.5c-23.3 0-42.3 19-42.3 42.5s18.9 42.5 42.3 42.5c13.8 0 26-6.6 33.7-16.9l-16.5-1.8C13.5 70.4 7.5 72.5 1 72.5c-16.2 0-29.3-13.2-29.3-29.4S-15.2 13.7 1 13.7c8.1 0 15.4 3.3 20.7 8.6l-10.9 11h32.5V.5L31 13z',
            fill: textFill
          })
        ),
        React.createElement('rect', {
          x: zoomInX - w / 2,
          y: y,
          rx: rx,
          ry: ry,
          height: h,
          width: w,
          fill: fill,
          fillOpacity: fillOpacity,
          stroke: stroke,
          strokeOpacity: strokeOpacity,
          strokeWidth: strokeWidth
        }),
        React.createElement('path', {
          d: zoomIn.toString(),
          stroke: textFill,
          strokeWidth: textStrokeWidth
        }),
        React.createElement('rect', {
          className: 'react-stockcharts-enable-interaction out',
          onClick: this.handleZoomOut,
          x: zoomOutX - w / 2,
          y: y,
          rx: rx,
          ry: ry,
          height: h,
          width: w,
          fill: 'none'
        }),
        React.createElement('rect', {
          className: 'react-stockcharts-enable-interaction reset',
          onClick: onReset,
          x: resetX - w / 2,
          y: y,
          rx: rx,
          ry: ry,
          height: h,
          width: w,
          fill: 'none'
        }),
        React.createElement('rect', {
          className: 'react-stockcharts-enable-interaction in',
          onClick: this.handleZoomIn,
          x: zoomInX - w / 2,
          y: y,
          rx: rx,
          ry: ry,
          height: h,
          width: w,
          fill: 'none'
        })
      );
    }
  }]);

  return ZoomButtons;
}(Component);

ZoomButtons.propTypes = {
  zoomMultiplier: PropTypes.number.isRequired,
  size: PropTypes.array.isRequired,
  heightFromBase: PropTypes.number.isRequired,
  rx: PropTypes.number.isRequired,
  ry: PropTypes.number.isRequired,
  stroke: PropTypes.string.isRequired,
  strokeWidth: PropTypes.number.isRequired,
  strokeOpacity: PropTypes.number.isRequired,
  fill: PropTypes.string.isRequired,
  fillOpacity: PropTypes.number.isRequired,
  fontSize: PropTypes.number.isRequired,
  textDy: PropTypes.string.isRequired,
  textFill: PropTypes.string.isRequired,
  textStrokeWidth: PropTypes.number.isRequired,
  onReset: PropTypes.func
};

ZoomButtons.defaultProps = {
  size: [30, 24],
  heightFromBase: 50,
  rx: 3,
  ry: 3,
  stroke: '#000000',
  strokeOpacity: 0.3,
  strokeWidth: 1,
  fill: '#D6D6D6',
  fillOpacity: 0.4,
  fontSize: 16,
  textDy: '.3em',
  textFill: '#000000',
  textStrokeWidth: 2,
  zoomMultiplier: 1.5,
  onReset: noop
};

ZoomButtons.contextTypes = {
  xScale: PropTypes.func.isRequired,
  chartConfig: PropTypes.object.isRequired,
  plotData: PropTypes.array.isRequired,
  xAccessor: PropTypes.func.isRequired,
  xAxisZoom: PropTypes.func.isRequired
};

export default ZoomButtons;
//# sourceMappingURL=ZoomButtons.js.map