import React from 'react'
import classNames from 'classnames'
import { Map } from 'immutable'
import Button from '../button/index'
import Checkbox from '../checkbox/index'

class TableSettingCard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.ininData(props.data),
            initData: JSON.parse(JSON.stringify(props.data)),
            height: null,
            top: -2000,
            firstVisible: props.visible
        }

    }

    getAbsPoint = (e) => {
        var x = e.offsetLeft
        var y = e.offsetTop
        while (e = e.offsetParent) {
            x += e.offsetLeft
            y += e.offsetTop
        }
        return { x, y }
    }

    componentDidMount() {
        let table = document.getElementsByClassName(this.props.positionClass)[0]
        if (table) {
            const point = this.getAbsPoint(table)
            let height = window.innerHeight - point.y
            this.setState({
                height,
                top: point.y
            })
        }
        window.addEventListener('resize', this.computed, false)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.computed, false)
    }

    componentWillReceiveProps(nextProps) {
        if( nextProps.visible != this.props.visible ) {
            this.state.firstVisible = true
        }
        const data = this.ininData(nextProps.data)
        this.setState({
            data: data,
            ininData: JSON.parse(JSON.stringify(data))
        })
    }

    ininData = (data) => {
        if (!data) {
            return []
        }
        try {
            //bug TTK-1361 栏目顺序显示不正确 myf
            // data.sort((a, b) => {
            //     return a.id > b.id
            // })
            return data
        } catch (err) {
            console.log(err)
        }

    }

    handleChange = (e, item) => {
        const { data } = this.state
        const index = data.findIndex(index => {
            return index.id == item.id
        })
        data[index] = {
            ...data[index],
            isVisible: e.target.checked
        }
        this.setState({
            data
        })
    }

    computed = () => {
        let table = document.getElementsByClassName(this.props.positionClass)[0]
        if (table) {
            const point = this.getAbsPoint(table)
            let height = window.innerHeight - point.y
            this.setState({
                height,
                top: point.y
            })
        }
    }

    renderItem = (data) => {
        const arrLeft = [],
            arrRight = []
        data.forEach((item) => {
            if (item.isHeader == true) {
                arrLeft.push(
                    <div className="mk-tableSetting-item">
                        <Checkbox
                            className={`${item.isVisible ? 'active' : ''}`}
                            checked={item.isVisible}
                            onChange={(value) => this.handleChange(value, item)}
                            disabled={item.isMustSelect}
                        >
                            {item.caption}
                        </Checkbox>
                    </div>
                )
            } else {
                arrRight.push(
                    <div className="mk-tableSetting-item">
                        <Checkbox
                            className={`${item.isVisible ? 'active' : ''}`}
                            checked={item.isVisible}
                            onChange={(value) => this.handleChange(value, item)}
                            disabled={item.isMustSelect}
                        >
                            {item.caption}
                        </Checkbox>
                    </div>
                )
            }
        })
        return [arrLeft, arrRight]
    }

    confirmClick = () => {
        this.setState({
            initData: JSON.parse(JSON.stringify(this.state.data))
        })
        if (this.props.confirmClick) {
            this.props.confirmClick(this.state.data)
        }
    }

    cancelClick = () => {
        this.setState({
            data: JSON.parse(JSON.stringify(this.state.initData))
        })
        if (this.props.cancelClick) {
            this.props.cancelClick()
        }
    }

    render() {
        const props = this.props
        let className = classNames({
            'mk-tableSetting': true,
            [props.className]: !!props.className,
            'animated': true,
            'slideInRight': this.props.visible,
            'slideOutRight': !this.props.visible
        })
        const { data, height, top } = this.state
        const [arrLeft, arrRight] = this.renderItem(data)
        return (
            <div
                className={className}
                style={{ 
                    height: `${height}px`, 
                    position: 'fixed',
                    right: '0px',
                    top: `${top}px`,
                    display: `${this.state.firstVisible == false ?  'none' : 'block'}`
                }}
            >
                <h2>栏目设置</h2>
                <div className="mk-tableSetting-header">
                    <span>表头</span>
                    <span>明细</span>
                </div>
                <div className="mk-tableSetting-container">
                    <div className="mk-tableSetting-title">
                        {arrLeft}
                    </div>
                    <div className="mk-tableSetting-detail">
                        {arrRight}
                    </div>
                    <div className="mk-tableSetting-line">
                    </div>
                </div>
                <div className="mk-tableSetting-bottom">
                    <Button className="mk-tableSetting-bottom-btn" onClick={this.cancelClick}>取消</Button>
                    <Button className="mk-tableSetting-bottom-btn" type="primary " onClick={this.confirmClick}>确定</Button>
                </div>
            </div>
        )
    }
}

export default TableSettingCard

