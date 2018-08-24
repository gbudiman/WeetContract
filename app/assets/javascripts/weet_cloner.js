var weet_cloner = function() {
  let oldest_content
  let template
  let feed
  let border

  let is_fetching
  let oldest_reached

  var init = function() {
    template = $('#weet-template')
    feed = $('#feed')
    border = $('#border')
    is_fetching = false
    oldest_reached = false
    attach_window_events()
  }

  var attach_window_events = function() {
    $(window).on('scroll resize', function() {
      window.requestAnimationFrame(function() {
        let w = $(window).height()
        let b = border[0].getBoundingClientRect().y

        if (b < w) {
          
          //setTimeout(fetch, 1000)
          if (!is_fetching && !oldest_reached) {
            fetch()
          }
        }
      })
      
    })

    fetch()
  }

  var fetch = function() {
    is_fetching = true
    $.ajax({
      method: 'GET',
      url: '/weets',
      data: {
        from: oldest_content
      }
    }).done(res => {
      if (res.length == 0) {
        oldest_reached = true
        border.text('No more Weet to display')
      } else {
        res.forEach(weet => {
          clone(weet)
        })
      }

      is_fetching = false
    })
  }

  var clone = function(weet) {
    if (oldest_content == undefined || weet.id < oldest_content) {
      let cloned = template.clone()
      cloned.attr('data-id', weet.id)
      feed.append(cloned)
      cloned.show()

      layout.set_content(weet.id, weet.weeter_id, weet.weeter_name, weet.weet_created_at, weet.weet_content)
      if (weet.weet_is_evaluated) {
        layout.publish_weet(weet.id, weet.weet_is_published)
      } else {
        layout.set_vote_timer(weet.id, moment(weet.weet_evaluate_at))
        layout.enable_vote(weet.id)
      }
      
      oldest_content = weet.id
    }
  }
  return {
    init: init
  }
}()