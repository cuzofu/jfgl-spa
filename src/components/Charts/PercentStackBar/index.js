import React, { Component } from 'react';
import { Chart, Axis, Tooltip, Geom, Legend, Coord } from 'bizcharts';
import { DataSet } from '@antv/data-set';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import autoHeight from '../autoHeight';
import styles from '../index.less';

@autoHeight()
class PercentStackBar extends Component {
  state = {
    autoHideXLabels: false,
  };

  componentDidMount() {
    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  @Bind()
  @Debounce(400)
  resize() {
    if (!this.node) {
      return;
    }
    const canvasWidth = this.node.parentNode.clientWidth;
    const { data = [], autoLabel = true } = this.props;
    if (!autoLabel) {
      return;
    }
    const minWidth = data.length * 30;
    const { autoHideXLabels } = this.state;

    if (canvasWidth <= minWidth) {
      if (!autoHideXLabels) {
        this.setState({
          autoHideXLabels: true,
        });
      }
    } else if (autoHideXLabels) {
      this.setState({
        autoHideXLabels: false,
      });
    }
  }

  handleRoot = n => {
    this.root = n;
  };

  handleRef = n => {
    this.node = n;
  };

  render() {
    const { height, title, forceFit = true, data, hasLegend = false, padding } = this.props;

    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.transform({
      type: 'percent',
      field: 'y', // 展开字段集
      dimension: 'x',
      groupBy: ['g'], // 以不同产品类别为分组
      as: 'percent',
    });
    const cols = {
      percent: {
        min: 0,
        formatter: val => {
          return (val * 100).toFixed(2) + '%';
        },
      },
    };

    return (
      <div className={styles.chart} style={{ height }} ref={this.handleRoot}>
        <div ref={this.handleRef}>
          {title && <h4 style={{ marginBottom: 20 }}>{title}</h4>}
          <Chart
            height={title ? height - 41 : height}
            forceFit={forceFit}
            scale={cols}
            data={dv}
            padding={padding || 'auto'}
          >
            {hasLegend && <Legend />}
            <Coord transpose />
            <Axis name="g" title={false} />
            <Axis name="percent" title={false} />
            <Tooltip />
            <Geom
              type="interval"
              opacity="field"
              adjust="stack"
              position="g*percent"
              color="x"
              tooltip={[
                'x*y*percent',
                (x, y, percent) => {
                  return { name: x, value: `${y}(${(percent * 100).toFixed(2)}%)` };
                },
              ]}
            />
          </Chart>
        </div>
      </div>
    );
  }
}

export default PercentStackBar;
