class EvaluatorWorker
  include Sidekiq::Worker

  def perform(*args)
    # Do something
    case args[0].to_sym
    when :evaluate then evaluate_weets
    when :blockchain then commit_to_blockchain
    end
  end

  def evaluate_weets
    Weeet.mass_evaluate
    User.mass_refill
    Blockchain.trigger_jobs
  end

  def commit_to_blockchain

  end
end
