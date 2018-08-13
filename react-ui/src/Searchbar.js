<form onSubmit={this.handleChange}>
 <input className={this.props.errorClass} ref={(input) => {
  this.textInput = input; }} type=”text” />
 <button onClick={this.handleChange}> Submit </button>
</form>

handleChange(evt) {
    evt.preventDefault();
    const location = this.textInput.value;
    this.props.onClick(location);
    this.textInput.value = '';
   };