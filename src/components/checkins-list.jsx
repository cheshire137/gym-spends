import React from 'react'

const weekdays = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday',
  'Saturday'
]

class CheckinsList extends React.Component {
  getWeekday(date) {
    return weekdays[date.getDay()]
  }

  getPrettyTime(date) {
    let hours = date.getHours()
    let amPm = 'am'
    if (hours > 12) {
      hours -= 12
      amPm = 'pm'
    }
    let minutes = date.getMinutes()
    if (minutes < 10) {
      minutes = `0${minutes}`
    }
    return `${hours}:${minutes} ${amPm}`
  }

  getTimestamp(dateInt) {
    const date = new Date(dateInt * 1000)
    const day = this.getWeekday(date)
    const dateStr = date.toLocaleDateString()
    const timeStr = this.getPrettyTime(date)
    return `${day}, ${dateStr} ${timeStr}`
  }

  render() {
    const { checkins } = this.props
    return (
      <ol className="checkins-list">
        {checkins.map(checkin => {
          return (
            <li key={checkin.id}>
              <span
                className="checkin-name"
              >{checkin.venue.name}</span>
              <time
                className="checkin-time space-before"
              >{this.getTimestamp(checkin.createdAt)}</time>
            </li>
          )
        })}
      </ol>
    )
  }
}

CheckinsList.propTypes = {
  checkins: React.PropTypes.array.isRequired
}

export default CheckinsList
