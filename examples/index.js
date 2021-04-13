// import echarts from 'echarts'
import * as echarts from 'echarts/core'
import { PieChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
echarts.use([TitleComponent, TooltipComponent, LegendComponent, PieChart, CanvasRenderer])

export default class UserComponent {
    constructor(container, config) {
        this.container = container
        this.config = config
        this.chart = echarts.init(this.container)
    }

    render(config) {
        this.config = config
        const { config: cfg = {} } = this.config
        // console.log(cfg)
        this.container.style.background = cfg.backgroundColor
        this.container.style.opacity = cfg.backgroundOpacity
        this.draw()
    }

    draw = () => {
        const { apiData = [] } = this.config

        const option = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: apiData.map(item => item.name)
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: apiData,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        }

        this.chart.setOption(option)
        this.chart.resize()
    }
}
