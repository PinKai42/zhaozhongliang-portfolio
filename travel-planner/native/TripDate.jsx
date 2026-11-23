import {createPortal} from 'react-dom';
import React from 'react';
export function tripDate(start,offset=0){const date=new Date(start+'T12:00:00');date.setDate(date.getDate()+offset);return {month:date.getMonth()+1,day:date.getDate(),year:date.getFullYear(),week:'日一二三四五六'[date.getDay()]};}
export default function TripDate({value, onChange}) {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState(value);
  const date = tripDate(value);

  function openDialog() {
    setDraft(value);
    setOpen(true);
  }

  function submitDate(event) {
    event.preventDefault();
    if (!draft) return;
    onChange(draft);
    setOpen(false);
  }

  return (
    <div className="trip-date-control">
      <button className="trip-date-trigger" aria-label="设置出发日期" onClick={openDialog}>
        出发日期：{date.year}年{date.month}月{date.day}日出发
      </button>
      {open && createPortal(
        <div className="trip-date-shade">
          <form className="trip-date-dialog" onSubmit={submitDate}>
            <h3>设置出发日期</h3>
            <input aria-label="出发日期" type="date" required value={draft} onChange={event => setDraft(event.target.value)} />
            <div><button type="button" onClick={() => setOpen(false)}>取消</button><button type="submit">确定</button></div>
          </form>
        </div>,
        document.body
      )}
    </div>
  );
}
